"use client"

import { useEffect, useState } from "react"
import {
  Users,
  Shield,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Crown,
  TrendingUp,
  AlertCircle,
  ArrowLeft,
  StopCircle,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { sampleUsers, adminStats } from "@/components/admin/data/admin-data"
import AdminRoleAssignmentModal from "@/components/admin/admin-role-assignment-modal"
import { baseUrl } from "@/lib/utils"
import FullScreenLoader from "@/components/FullScreenLoader"

interface SuperAdminDashboardProps {
  currentUser: User
  onClose?: () => void
}

type AdminRole = {
  name: string
  displayName: string
}

type User = {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  lastLogin?: string
  status: "active" | "inactive" | "suspended"
  admin?: {
    permission: string[]
  }
  permission: string[]
  isSystem: boolean
}

export default function SuperAdminDashboard({ currentUser, onClose }: SuperAdminDashboardProps) {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [fetchingUsers, setFetchingUsers] = useState(false)
  const [isProcessing, setIsProcessing] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const isAdmin = Array.isArray(user.admin?.permission) && user.admin.permission.length > 0
    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && isAdmin) ||
      (filterRole === "user" && !isAdmin)

    return matchesSearch && matchesRole
  })

  const fetchAllAdminUsers = async () => {
    const permissions = currentUser?.admin?.permission || []
    if (!Array.isArray(permissions) || !permissions.includes("super_admin")) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setFetchingUsers(true)
      const res = await fetch(`${baseUrl}/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setFetchingUsers(false)
    }
  }

  useEffect(() => {
    fetchAllAdminUsers()
  }, [currentUser])

  const hasPermission = (user: User, key: string) =>
    Array.isArray(user.admin?.permission) && user.admin.permission.includes(key)

  const handleMakeAdmin = (user: User) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
  }

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      setIsProcessing(userId)

      const response = await fetch(`${baseUrl}/admin/remove-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      })

      const data = await response.json()
      if (!response.ok) return

      setIsProcessing('')
      fetchAllAdminUsers()
    } catch (err) {
      setIsProcessing('')
    }
  }

  const handleRoleAssignment = async (userId: string, role: AdminRole) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const payload = { userId, roles: [role.id] }

      const response = await fetch(`${baseUrl}/admin/assign-role`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) return

      await response.json()
      fetchAllAdminUsers()
      setIsRoleModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSuspendUser = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "suspended" ? "active" : "suspended" }
          : user,
      ),
    )
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      case "suspended": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (permissions: string[] = []) => {
    const role = permissions[0]
    switch (role) {
      case "super_admin": return "bg-red-100 text-red-800"
      case "content_admin": return "bg-blue-100 text-blue-800"
      case "support_admin": return "bg-green-100 text-green-800"
      case "sales_admin": return "bg-purple-100 text-purple-800"
      case "user_admin": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  function formatAdminPermissions(permissions: string[]): string {
    if (!permissions || permissions.length === 0) return "No Role"
    const names = {
      super_admin: "Super Admin",
      feedback_admin: "Feedback Admin",
      author_admin: "Author Admin",
      content_admin: "Content Admin",
    }
    const display = names[permissions[0]] || permissions[0]
    return permissions.length === 1 ? display : `${display} & ${permissions.length - 1} other${permissions.length - 1 > 1 ? "s" : ""}`
  }

  return (
    <>
      {isProcessing && <FullScreenLoader />}

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
                </Button>
                <Crown className="w-8 h-8 text-red-600" /> */}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Super Admin Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage users, admins, and system operations</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
                  <AvatarFallback className="bg-red-100 text-red-600 text-sm">
                    {currentUser.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{currentUser.name}</div>
                  <div className="text-xs text-red-600">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { title: "Users", count: users.length, icon: <Users className="w-6 h-6 text-blue-600" />, color: "bg-blue-100" },
              { title: "Admins", count: 0, icon: <Shield className="w-6 h-6 text-red-600" />, color: "bg-red-100" },
              { title: "Sales", count: 0, icon: <TrendingUp className="w-6 h-6 text-green-600" />, color: "bg-green-100" },
              { title: "Reviews", count: 0, icon: <AlertCircle className="w-6 h-6 text-orange-600" />, color: "bg-orange-100" },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.count}</p>
                    </div>
                    <div className={`w-9 h-9 ${stat.color} rounded-full flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* User Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-2 w-full sm:w-auto border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Users</option>
                    <option value="admin">Admins Only</option>
                    <option value="user">Regular Users</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
            
                <Table className="min-w-full">
                                            <TableHeader>
                                                <TableRow>
                                                <TableHead>User</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Join Date</TableHead>
                                                <TableHead>Last Login</TableHead>
                                                <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                
                                            <TableBody>
                                                {fetchingUsers
                                                ? [...Array(3)].map((_, i) => (
                                                    <TableRow key={`loading-${i}`} className="animate-pulse">
                                                        <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                                            <div className="flex flex-col gap-1">
                                                            <div className="w-32 h-3 bg-gray-200 rounded"></div>
                                                            <div className="w-24 h-2 bg-gray-100 rounded"></div>
                                                            </div>
                                                        </div>
                                                        </TableCell>
                                                        <TableCell>
                                                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                                        </TableCell>
                                                        <TableCell>
                                                        <div className="w-16 h-3 bg-gray-200 rounded"></div>
                                                        </TableCell>
                                                        <TableCell>
                                                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                                        </TableCell>
                                                        <TableCell>
                                                        <div className="w-24 h-3 bg-gray-200 rounded"></div>
                                                        </TableCell>
                                                        <TableCell>
                                                        <div className="w-8 h-3 bg-gray-200 rounded mx-auto"></div>
                                                        </TableCell>
                                                    </TableRow>
                                                    ))
                                                : filteredUsers.map((user) => (
                                                    <TableRow key={user.id}>
                                                        <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="w-8 h-8">
                                                                {
                                                                    isProcessing === user.id && <div className="absolute inset-0 rounded-full border-[3px] border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                                                }
                                                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                                                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                                                {user.name
                                                                .split(" ")
                                                                .map((n) => n[0])
                                                                .join("")}
                                                            </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                            <div className="font-medium text-gray-900">{user.name}</div>
                                                            <div className="text-sm text-gray-500">{user.email}</div>
                                                            </div>
                                                        </div>
                                                        </TableCell>
                                                        <TableCell>
                                                        {user?.permission ? (
                                                            <Badge className={getRoleColor(user?.permission)}>
                                                            <Shield className="w-3 h-3 mr-1" />
                                                            {formatAdminPermissions(user?.permission)}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline">Regular User</Badge>
                                                        )}
                                                        </TableCell>
                                                        <TableCell>
                                                        <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-600">{formatDate(user.joinDate)}</TableCell>
                                                        <TableCell className="text-sm text-gray-600">
                                                        {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                                                        </TableCell>
                                                        <TableCell>
                
                
                                                            {
                                                                !user?.isSystem
                                                                ?
                                                                <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm">
                                                                <MoreHorizontal className="w-4 h-4" />
                                                            </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Edit User
                                                            </DropdownMenuItem>
                
                                                            {!user?.permission ? (
                                                                <DropdownMenuItem onClick={() => handleMakeAdmin(user)}>
                                                                <UserCheck className="w-4 h-4 mr-2" />
                                                                Make Admin
                                                                </DropdownMenuItem>
                                                            ) : (
                                                               
                                                                <>
                                                                    <DropdownMenuItem onClick={() => handleMakeAdmin(user)}>
                                                                    <Edit className="w-4 h-4 mr-2" />
                                                                    Change Role
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleRemoveAdmin(user.id)}>
                                                                    <UserX className="w-4 h-4 mr-2" />
                                                                    Remove Admin
                                                                    </DropdownMenuItem>
                                                                </>
                                                                
                                                            )}
                
                                                            <DropdownMenuSeparator />
                
                                                            <DropdownMenuItem
                                                                onClick={() => handleSuspendUser(user.id)}
                                                                className={user.status === "suspended" ? "text-green-600" : "text-red-600"}
                                                            >
                                                                {user.status === "suspended" ? (
                                                                <>
                                                                    <UserCheck className="w-4 h-4 mr-2" />
                                                                    Activate User
                                                                </>
                                                                ) : (
                                                                <>
                                                                    <UserX className="w-4 h-4 mr-2" />
                                                                    Suspend User
                                                                </>
                                                                )}
                                                            </DropdownMenuItem>
                
                                                        
                                                                <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="w-4 h-4 mr-2" />
                                                                Delete User
                                                                </DropdownMenuItem>
                                                            
                                                            </DropdownMenuContent>
                                                        </DropdownMenu> 
                                                        :
                                                        <DropdownMenu>
                                                            <DropdownMenuContent align="end">
                                                            <DropdownMenuItem disabled>
                                                            <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                                                            Super Admin (Locked)
                                                            </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                            
                                                        </DropdownMenu>
                                                            }
                                                        
                                                       
                                                        </TableCell>
                                                    </TableRow>
                                                    ))}
                                            </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal */}
        <AdminRoleAssignmentModal
          isOpen={isRoleModalOpen}
          onClose={() => {
            setIsRoleModalOpen(false)
            setSelectedUser(null)
          }}
          user={selectedUser}
          onAssignRole={handleRoleAssignment}
        />
      </div>
    </>
  )
}
