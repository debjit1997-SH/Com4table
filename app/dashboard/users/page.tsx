"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Mail, User, AlertCircle, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useSession } from "next-auth/react"

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState([])
  const [pendingUsers, setPendingUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [error, setError] = useState("")
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "cashier",
  })

  // Fetch users from the database
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()

        // Separate authorized and pending users
        const authorized = data.filter((user) => user.authorized)
        const pending = data.filter((user) => !user.authorized)

        setUsers(authorized)
        setPendingUsers(pending)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError("Name and email are required")
      return
    }

    if (!newUser.email.includes("@")) {
      setError("Please enter a valid email address")
      return
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newUser,
          authorized: true,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to add user")
      }

      // Refresh users list
      const updatedUsersResponse = await fetch("/api/users")
      const updatedUsersData = await updatedUsersResponse.json()

      // Separate authorized and pending users
      const authorized = updatedUsersData.filter((user) => user.authorized)
      const pending = updatedUsersData.filter((user) => !user.authorized)

      setUsers(authorized)
      setPendingUsers(pending)

      setNewUser({ name: "", email: "", role: "cashier" })
      setShowAddDialog(false)
      setError("")
    } catch (error) {
      console.error("Error adding user:", error)
      setError(error.message)
    }
  }

  const handleAuthorizeUser = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorized: true,
          role: "cashier", // Default role for new users
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to authorize user")
      }

      // Refresh users list
      const updatedUsersResponse = await fetch("/api/users")
      const updatedUsersData = await updatedUsersResponse.json()

      // Separate authorized and pending users
      const authorized = updatedUsersData.filter((user) => user.authorized)
      const pending = updatedUsersData.filter((user) => !user.authorized)

      setUsers(authorized)
      setPendingUsers(pending)
    } catch (error) {
      console.error("Error authorizing user:", error)
      setError("Failed to authorize user")
    }
  }

  const handleDeleteUser = async (id) => {
    // Prevent deleting the current user
    if (id === session?.user?.id) {
      setError("You cannot delete your own account")
      setTimeout(() => setError(""), 3000)
      return
    }

    const user = users.find((u) => u._id === id) || pendingUsers.find((u) => u._id === id)
    setUserToDelete(user)
    setShowDeleteDialog(true)
  }

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      try {
        const response = await fetch(`/api/users/${userToDelete._id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete user")
        }

        // Refresh users list
        const updatedUsersResponse = await fetch("/api/users")
        const updatedUsersData = await updatedUsersResponse.json()

        // Separate authorized and pending users
        const authorized = updatedUsersData.filter((user) => user.authorized)
        const pending = updatedUsersData.filter((user) => !user.authorized)

        setUsers(authorized)
        setPendingUsers(pending)

        setShowDeleteDialog(false)
        setUserToDelete(null)
      } catch (error) {
        console.error("Error deleting user:", error)
        setError("Failed to delete user")
      }
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: newRole,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user role")
      }

      // Refresh users list
      const updatedUsersResponse = await fetch("/api/users")
      const updatedUsersData = await updatedUsersResponse.json()

      // Separate authorized and pending users
      const authorized = updatedUsersData.filter((user) => user.authorized)
      const pending = updatedUsersData.filter((user) => !user.authorized)

      setUsers(authorized)
      setPendingUsers(pending)
    } catch (error) {
      console.error("Error updating user role:", error)
      setError("Failed to update user role")
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      case "manager":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "cashier":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  // Update the getRoleDescription function to better define the roles
  const getRoleDescription = (role) => {
    switch (role) {
      case "admin":
        return "Full access to all features, settings, and user management"
      case "manager":
        return "Can manage products, customers, billing, and view reports. Cannot manage users or change system settings."
      case "cashier":
        return "Can create bills and manage customers. Limited access to reports and no access to settings."
      case "pending":
        return "Waiting for authorization. No access to the system."
      default:
        return ""
    }
  }

  // Add a function to check if a user has permission for a specific feature
  const hasPermission = (role, feature) => {
    const permissions = {
      admin: ["billing", "invoices", "customers", "products", "reports", "users", "settings"],
      manager: ["billing", "invoices", "customers", "products", "reports"],
      cashier: ["billing", "customers"],
      pending: [],
    }

    return permissions[role]?.includes(feature) || false
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading users...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {pendingUsers.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="text-yellow-800 dark:text-yellow-400">Pending Authorization</CardTitle>
            <CardDescription>Users who have signed up but need authorization</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                        variant="outline"
                      >
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleAuthorizeUser(user._id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Authorize
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Authorized Users</CardTitle>
          <CardDescription>Manage users who can access the billing system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Access Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        defaultValue={user.role}
                        onValueChange={(value) => handleUpdateUserRole(user._id, value)}
                        disabled={user._id === session?.user?.id} // Can't change own role
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="cashier">Cashier</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {hasPermission(user.role, "billing") && (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          >
                            Billing
                          </Badge>
                        )}
                        {hasPermission(user.role, "invoices") && (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          >
                            Invoices
                          </Badge>
                        )}
                        {hasPermission(user.role, "customers") && (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400"
                          >
                            Customers
                          </Badge>
                        )}
                        {hasPermission(user.role, "products") && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                          >
                            Products
                          </Badge>
                        )}
                        {hasPermission(user.role, "reports") && (
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
                          >
                            Reports
                          </Badge>
                        )}
                        {hasPermission(user.role, "users") && (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                          >
                            Users
                          </Badge>
                        )}
                        {hasPermission(user.role, "settings") && (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                          >
                            Settings
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user._id)}
                        disabled={user._id === session?.user?.id} // Can't delete own account
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No authorized users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Add a new user to the billing system</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <div className="flex items-center border rounded-md pl-3">
                <User className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="name"
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="border-0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center border rounded-md pl-3">
                <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="border-0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="cashier">Cashier</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">{getRoleDescription(newUser.role)}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {userToDelete && (
            <div className="flex items-center gap-3 py-4">
              <Avatar>
                <AvatarImage src={userToDelete.image} alt={userToDelete.name} />
                <AvatarFallback>{userToDelete.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userToDelete.name}</p>
                <p className="text-sm text-muted-foreground">{userToDelete.email}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

