"use client"

import { useEffect, useState } from "react"
import { X, Shield, Users, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { User, AdminRole } from "@/components/admin/types/admin"
import { adminRoles } from "@/components/admin/data/admin-data"

interface AdminRoleAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  onAssignRole: (userId: string, role: AdminRole) => void
}

// interface AdminRole {
//   id: string
//   name: string
//   displayName: string
//   description?: string
//   color?: string
//   permissions: string[]
// }

// interface User {
//   id: string
//   name: string
//   email: string
//   image?: string
//   isAdmin?: boolean
//   admin?: {
//     permission: string[]
//     role: string
//   }
//   permission?: string[]
// }

interface Props {
  user: User
  onClose: () => void
  onAssignRole: (userId: string, role: AdminRole) => void
}

export default function AdminRoleAssignmentModal({
  isOpen,
  onClose,
  user,
  onAssignRole,
}: AdminRoleAssignmentModalProps) {



  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null)
  const [isAssigning, setIsAssigning] = useState(false)

  // ✅ Always call hooks unconditionally
useEffect(() => {

  if (isOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }

  if (!isOpen) {
    setIsAssigning(false);
    setSelectedRole(null); // Optional: reset selected role as well
  }

  return () => {
    document.body.style.overflow = ""
  }
}, [isOpen])



  if (!isOpen || !user) return null

const handleAssignRole = async () => {
    if (!selectedRole) return
    setIsAssigning(true)

    const minimalRole: AdminRole = {
      id: selectedRole.id,
      name: selectedRole.name,
      displayName: selectedRole.displayName,
      permissions: [selectedRole.name], // ✅ only assign role name as flat array
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    onAssignRole(user.id, minimalRole)
   // setIsAssigning(false)
   // setSelectedRole(null)
  }


  const handleClose = () => {
    setSelectedRole(null)
    onClose()
  }

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case "super_admin":
        return "border-red-200 bg-red-50"
      case "content_admin":
        return "border-blue-200 bg-blue-50"
      case "support_admin":
        return "border-green-200 bg-green-50"
      case "sales_admin":
        return "border-purple-200 bg-purple-50"
      case "user_admin":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getBadgeColor = (roleName: string) => {
    switch (roleName) {
      case "super_admin":
        return "bg-red-100 text-red-800"
      case "content_admin":
        return "bg-blue-100 text-blue-800"
      case "support_admin":
        return "bg-green-100 text-green-800"
      case "sales_admin":
        return "bg-purple-100 text-purple-800"
      case "user_admin":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const availableRoles = adminRoles.filter((role) => role.name)
//   const availableRoles = adminRoles.filter((role) => role.name !== "super_admin")

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 hover:bg-white/20 text-white h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Assign Admin Role</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                {user.isAdmin ? "Change admin role for user" : "Grant admin privileges to user"}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 border-b">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  {user?.permission ? (
                    <Badge>
                      Already Admin
                    </Badge>
                  ) : (
                    <Badge variant="outline">Regular User</Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    Joined {new Date(user.joinDate).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </div>

            {user?.permission && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="font-medium text-amber-800">Suspended</span>
                </div>
                <p className="text-sm text-amber-700">
                  This user is currently suspended and can't hold any role
                </p>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Select Admin Role
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {availableRoles.map((role) => (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedRole?.id === role.id
                      ? `ring-2 ring-green-500 ${getRoleColor(role.name)}`
                      : `hover:shadow-md ${getRoleColor(role.name)}`
                  }`}
                  onClick={() => {
                    setSelectedRole(role)
                }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-500" />
                        {role.displayName} {user.permission?.includes(role.id) && (
                                            <Badge className="bg-yellow-100 text-yellow-800">Already Admin</Badge>
                                            )}
                      </CardTitle>
                      {selectedRole?.id === role.id && <CheckCircle className="w-5 h-5 text-blue-600" />}
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Permissions:</h4>
                        <div className="space-y-1">
                          {role.permissions.slice(0, 4).map((permission) => (
                            <div key={permission.id} className="flex items-center gap-2 text-xs text-gray-600">
                              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                              {permission.name}
                            </div>
                          ))}
                          {role.permissions.length > 4 && (
                            <div className="text-xs text-gray-500">
                              +{role.permissions.length - 4} more permissions
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedRole && (
              <Card className="mt-6 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-900">Selected Role: {selectedRole.displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-blue-800">{selectedRole.description}</p>
                    <div>
                      <h4 className="font-medium text-sm text-blue-900 mb-2">
                        Full Permissions ({selectedRole.permissions.length}):
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedRole.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center gap-2 text-xs text-blue-700">
                            <CheckCircle className="w-3 h-3" />
                            {permission.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
      <div className="border-t bg-white p-6">
  <div className="flex flex-col sm:flex-row gap-3">
    <Button
      variant="outline"
      onClick={handleClose}
      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
      disabled={isAssigning}
    >
      Cancel
    </Button>
    <Button
      onClick={handleAssignRole}
      disabled={!selectedRole || isAssigning}
      className={`flex-1 text-white disabled:opacity-50 ${
        selectedRole?.id
          ? user.permission?.includes(selectedRole.id)
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
          : "bg-gray-400 hover:bg-gray-500"
      }`}
    >
      {isAssigning ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {selectedRole?.id && user.permission?.includes(selectedRole.id)
            ? "Removing Role..."
            : "Assigning Role..."}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {selectedRole?.id && user.permission?.includes(selectedRole.id)
            ? "Remove Role"
            : "Assign Role"}
        </div>
      )}
    </Button>
  </div>
</div>

      </div>
    </div>
  )
}
