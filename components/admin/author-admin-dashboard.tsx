"use client"

import { useEffect, useState } from "react"
import {
    UserCheck,
    Search,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Github,
    Linkedin,
    Globe,
    Package,
    ArrowLeft,
    AlertTriangle,CheckSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, AuthorApplication } from "@/components/admin/types/admin"
import { sampleAuthorApplications } from "@/components/admin/data/admin-data"
import AuthorApplicationModal from "@/components/admin/author-application-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SERVER_PUBLIC, maskEmail } from "@/lib/utils"

interface AuthorAdminDashboardProps {
    currentUser: User
    onClose?: () => void
}

const SkeletonApplicationCard = () => (
  <Card className="animate-pulse border-l-4 border-l-gray-300">
    <CardContent className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="w-1/2 h-4 bg-gray-200 rounded" />
          <div className="w-1/3 h-3 bg-gray-200 rounded" />
          <div className="w-full h-3 bg-gray-200 rounded" />
          <div className="w-5/6 h-3 bg-gray-200 rounded" />
          <div className="flex gap-2 mt-2">
            <div className="w-12 h-4 bg-gray-200 rounded" />
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)


export default function AuthorAdminDashboard({ currentUser, onClose }: AuthorAdminDashboardProps) {
    const [applications, setApplications] = useState<AuthorApplication[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [selectedApplication, setSelectedApplication] = useState<AuthorApplication | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [fetchingApplication, setFetchingApplication] = useState(false)
    const [statsCount, setStatsCount] = useState({})

    useEffect(()=>{
       // console.log(currentUser, 'currentUser')
        fetchAuthorsApplications()
    },[])

    const fetchAuthorsApplications = async () => {
  try {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("No token found")

    setFetchingApplication(true)

    const response = await fetch(`${SERVER_PUBLIC}/admin/author-applications`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch applications")
    }

    const data = await response.json()

    console.log(data.applications, 'users applications')

    // ✅ Update your state
    setApplications(data.applications || [])
    setStatsCount(data.stats)

  } catch (error) {
    console.error("Error fetching applications:", error)
  } finally {
    // ✅ Always stop the loading indicator
    setFetchingApplication(false)
  }
}



    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesStatus = statusFilter === "all" || app.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleReviewApplication = (application: AuthorApplication) => {
        setSelectedApplication(application)
        setIsModalOpen(true)
    }

  const handleApplicationDecision = async (
  applicationId: string,
  status: "approved" | "rejected",
  notes: string
) => {
  console.log(applicationId, status, notes)

  try {
    const token = localStorage.getItem("token")

    if (!token) {
      console.error("No token found")
      return
    }

    const res = await fetch(`${SERVER_PUBLIC}/admin/author-decision`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: applicationId,
        decision: status,
        notes
      })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || "Failed to process decision")
    }

    // ✅ After success
    setIsModalOpen(false)

    setSelectedApplication(null)

    console.log(`Application ${status} successfully`)

    fetchAuthorsApplications()

  } catch (error: any) {
    console.log("Decision error:", error)
    //alert(error.message || "An error occurred")
  }
}


    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "true":
                return <Badge className="bg-green-100 text-green-800">Approved</Badge>
            case "false":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            default:
               return null 
        }
    }

    const getPriorityColor = (application: AuthorApplication) => {
        const daysSinceApplication = Math.floor(
            (Date.now() - new Date(application.applicationDate).getTime()) / (1000 * 60 * 60 * 24),
        )

        if (application.status) return "border-l-gray-400"
        if (daysSinceApplication > 7) return "border-l-red-400"
        if (daysSinceApplication > 3) return "border-l-orange-400"
        return "border-l-yellow-400"
    }

    const pendingApplications = applications.filter((app) => app.status === "pending")
    const approvedApplications = applications.filter((app) => app.status === "approved")
    const rejectedApplications = applications.filter((app) => app.status === "rejected")




    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between sm:h-16 gap-4 py-4 sm:py-0">
              <div className="flex items-center gap-3">
                            {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={onClose || (() => window.history.back())}
                                className="mr-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button> */}
                            <UserCheck className="w-8 h-8 text-green-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Author Admin Dashboard</h1>
                                <p className="text-sm text-gray-500">Review and approve author applications</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                                <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                                    {currentUser.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-right">
                                <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                                <div className="text-xs text-green-600">Author Admin</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                                    <p className="text-1xl font-bold text-yellow-600">{applications.length}</p>
                                </div>
                                <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                    <p className="text-1xl font-bold text-green-600">{statsCount?.approvedByAdmin}</p>
                                </div>
                                <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Rejected</p>
                                    <p className="text-1xl font-bold text-red-600">{statsCount?.rejectedByAdmin}</p>
                                </div>
                                <div className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center">
                                    <XCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>

                {/* Main Content with Tabs */}
                <Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2 text-md">
      <UserCheck className="w-5 h-5" />
      Author Management
    </CardTitle>
  </CardHeader>

  <CardContent>
    <Tabs defaultValue="applications" className="w-full">
      <TabsList className="grid grid-cols-2 max-w-full sm:max-w-md w-full mb-6">
        <TabsTrigger value="applications">Author</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <TabsContent value="applications" className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {fetchingApplication ? (
            <>
              <SkeletonApplicationCard />
              <SkeletonApplicationCard />
              <SkeletonApplicationCard />
              <SkeletonApplicationCard />
            </>
          ) : filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <Card
                key={application.id}
                className={`border-l-4 ${application.status ? 'border-l-green-500' : 'border-l-yellow-400'} hover:shadow-md transition-shadow`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 w-full">
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage
                          src={application.userAvatar || "/placeholder.svg"}
                          alt={application.userName}
                        />
                        <AvatarFallback className="bg-green-100 text-green-600">
                          {application.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{application.userName}</h3>
                            <p className="text-sm text-gray-600 break-all mb-2">
                              {currentUser.isSystem
                                ? application.userEmail
                                : maskEmail(application.userEmail)}
                            </p>
                          </div>
                          {/* {getStatusBadge(application.status)} */}

                          {
                            application.status === true
                            ? <div className="text-green-500 text-sm">Approved</div>
                            : application.authorReviewStatus === "rejected"
                            ? <div className="text-red-500 text-sm">Rejected</div>
                            : <div className="text-yellow-500 text-sm">Pending</div>
                          }
                        </div>

                        {/* <div className="mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">{application.experience}</p>
                        </div> */}

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Applied: {formatDate(application.applicationDate)}</span>
                          </div>
                          {/* {application.portfolio && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              <a
                                href={application.portfolio}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:underline break-all"
                              >
                                Portfolio
                              </a>
                            </div>
                          )} */}
                        </div>

                        {/* <div className="flex flex-wrap gap-2 mb-3">
                          {application.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div> */}

                        {/* <div className="flex flex-wrap gap-3">
                          {application.socialLinks.map((link, index) => (
                            <a
                              key={index}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-500 hover:text-gray-700"
                            >
                              {link.platform === "GitHub" && <Github className="w-4 h-4" />}
                              {link.platform === "LinkedIn" && <Linkedin className="w-4 h-4" />}
                              {["Dribbble", "Behance"].includes(link.platform) && <Globe className="w-4 h-4" />}
                            </a>
                          ))}
                        </div> */}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReviewApplication(application)}
                        className="flex items-center gap-2 w-full sm:w-auto"
                      >
                        <CheckSquare className="w-4 h-4" />
                        Review
                      </Button>
                    </div>
                  </div>

                  {/* {application.reviewNotes && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">Review Notes:</span>
                      </div>
                      <p className="text-sm text-gray-700">{application.reviewNotes}</p>
                      {application.reviewedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          By {application.reviewedBy} on {formatDate(application.reviewedAt)}
                        </p>
                      )}
                    </div>
                  )} */}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </TabsContent>

      {/* Recent Activity */}
      <TabsContent value="activity" className="space-y-4">
        <div className="space-y-4">
          {[
            {
              id: "1",
              action: "Approved author application",
              details: "Sarah Johnson - UI/UX Designer with 5+ years experience",
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              type: "approved",
            },
            {
              id: "2",
              action: "Rejected application",
              details: "Insufficient portfolio examples provided",
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              type: "rejected",
            },
            {
              id: "3",
              action: "Reviewed application",
              details: "Michael Chen - Full-stack developer application under review",
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              type: "reviewed",
            },
            {
              id: "4",
              action: "Approved author application",
              details: "Emma Davis - Graphic designer with strong Figma skills",
              timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
              type: "approved",
            },
            {
              id: "5",
              action: "Requested additional info",
              details: "Asked for more portfolio examples from Alex Rodriguez",
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              type: "info_requested",
            },
          ].map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === "approved" && <CheckCircle className="w-4 h-4 text-green-600" />}
                    {activity.type === "rejected" && <XCircle className="w-4 h-4 text-red-600" />}
                    {activity.type === "reviewed" && <Eye className="w-4 h-4 text-blue-600" />}
                    {activity.type === "info_requested" && (
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{activity.action}</h3>
                        <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-2 sm:mt-0 sm:ml-4 whitespace-nowrap">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  </CardContent>
</Card>

            </div>

            {/* Author Application Modal */}
            <AuthorApplicationModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false)
                    setSelectedApplication(null)
                }}
                application={selectedApplication}
                onDecision={handleApplicationDecision}
            />
        </div>
    )
}
