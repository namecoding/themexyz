import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { verifyTokenFromHeader } from '@/lib/jwt'
import { ObjectId } from 'mongodb'

export async function GET(request: Request) {
  try {
    const decoded: any = verifyTokenFromHeader(request)
    const userId = decoded?.userId

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid or missing token.' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    const usersCollection = db.collection('users')

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 })
    }

    const permissions = user?.admin?.permission || []

    if (!permissions.includes('author_admin')) {
      return NextResponse.json(
        { success: false, message: 'Access denied: Author admin only.' },
        { status: 403 }
      )
    }

    // ✅ Fetch pending author applications
    const authorDocs = await usersCollection
      .find({ isAuthor: 1, authorityToSell: { $ne: true } }) //authorityToSell: { $ne: true }
      .sort({ createdAt: -1 })
      .toArray()

    // ✅ Step 1: Extract unique reviewedBy IDs
    const reviewerIds = Array.from(
      new Set(
        authorDocs
          .map((doc) => doc.reviewedBy)
          .filter((id) => id) // remove null/undefined
          .map((id) => id.toString())
      )
    )

    // ✅ Step 2: Fetch reviewers
    const reviewersMap: Record<string, string> = {}
    if (reviewerIds.length > 0) {
      const reviewerDocs = await usersCollection
        .find({ _id: { $in: reviewerIds.map((id) => new ObjectId(id)) } })
        .toArray()

      reviewerDocs.forEach((reviewer) => {
        reviewersMap[reviewer._id.toString()] = reviewer.name || 'Unknown'
      })
    }

    // ✅ Step 3: Build applications with reviewer names
    const applications = authorDocs.map((userDoc, index) => {
      const reviewedById = userDoc.reviewedBy?.toString()
      return {
        id: (index + 1).toString(),
        userId: userDoc._id.toString(),
        userName: userDoc.name,
        userEmail: userDoc.email,
        userAvatar:
          userDoc.profile?.avatar || userDoc.avatar || null,
        applicationDate: userDoc.authorSince || userDoc.createdAt || null,
       status: userDoc.authorityToSell === true,
        portfolio: userDoc.profile?.portfolio || userDoc.profile?.website || "",
        experience: userDoc.profile?.bio || "No bio provided.",
        specialties: userDoc?.specialties || [],
        reviewNotes: userDoc?.authorReviewNotes || '',
        reviewedAt: userDoc?.reviewedAt,
        reviewedBy: reviewersMap[reviewedById] || null,
        authorReviewStatus:userDoc?.authorReviewStatus,
        socialLinks: [
          ...(userDoc.profile?.website
            ? [{ platform: "Website", url: userDoc.profile.website }]
            : []),
          ...(userDoc.profile?.github
            ? [{ platform: "GitHub", url: userDoc.profile.github }]
            : []),
          ...(userDoc.profile?.linkedin
            ? [{ platform: "LinkedIn", url: userDoc.profile.linkedin }]
            : []),
        ],
      }
    })

    // ✅ Count approvals/rejections by this admin
    const approvedByAdmin = await usersCollection.countDocuments({
      reviewedBy: new ObjectId(userId),
      authorReviewStatus: 'approved',
      authorityToSell: true,
    })

    const rejectedByAdmin = await usersCollection.countDocuments({
      reviewedBy: new ObjectId(userId),
      authorReviewStatus: 'rejected',
      authorityToSell: false,
    })

    return NextResponse.json({
      success: true,
      applications,
      stats: {
        approvedByAdmin,
        rejectedByAdmin,
      },
    })
  } catch (error) {
    console.error('Error fetching author applications:', error)
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 })
  }
}
