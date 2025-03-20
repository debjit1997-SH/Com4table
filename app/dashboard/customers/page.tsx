"use client"

import { useState } from "react"
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
import { Plus, Trash2, Edit, Search, User, Phone, Mail, MapPin, FileText } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "9876543210",
      address: "123 Main St, City, State, 400001",
      totalSpent: 12500,
      lastPurchase: "2023-03-15",
      type: "regular",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "8765432109",
      address: "456 Park Ave, Town, State, 400002",
      totalSpent: 8750,
      lastPurchase: "2023-03-10",
      type: "regular",
    },
    {
      id: 3,
      name: "Raj Kumar",
      email: "raj.kumar@example.com",
      phone: "7654321098",
      address: "789 Oak St, Village, State, 400003",
      totalSpent: 25000,
      lastPurchase: "2023-03-05",
      type: "vip",
    },
    {
      id: 4,
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "6543210987",
      address: "101 Pine St, Suburb, State, 400004",
      totalSpent: 15000,
      lastPurchase: "2023-02-28",
      type: "regular",
    },
    {
      id: 5,
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "5432109876",
      address: "202 Maple St, District, State, 400005",
      totalSpent: 30000,
      lastPurchase: "2023-02-20",
      type: "vip",
    },
  ])

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "regular",
  })

  const handleAddCustomer = () => {
    if (newCustomer.name && (newCustomer.phone || newCustomer.email)) {
      setCustomers([
        ...customers,
        {
          id: customers.length + 1,
          name: newCustomer.name,
          email: newCustomer.email,
          phone: newCustomer.phone,
          address: newCustomer.address,
          totalSpent: 0,
          lastPurchase: null,
          type: newCustomer.type,
        },
      ])

      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        type: "regular",
      })

      setShowAddDialog(false)
    }
  }

  const handleEditCustomer = () => {
    if (currentCustomer && currentCustomer.name) {
      setCustomers(customers.map((customer) => (customer.id === currentCustomer.id ? currentCustomer : customer)))
      setShowEditDialog(false)
    }
  }

  const handleDeleteCustomer = () => {
    if (currentCustomer) {
      setCustomers(customers.filter((customer) => customer.id !== currentCustomer.id))
      setShowDeleteDialog(false)
      setCurrentCustomer(null)
    }
  }

  const openEditDialog = (customer) => {
    setCurrentCustomer({ ...customer })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (customer) => {
    setCurrentCustomer(customer)
    setShowDeleteDialog(true)
  }

  const createNewBill = (customer) => {
    // In a real app, this would pass the customer data to the billing page
    router.push("/dashboard/billing")
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (customer.phone && customer.phone.includes(searchTerm)),
  )

  const formatDate = (dateString) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email or phone..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Customers</TabsTrigger>
          <TabsTrigger value="vip">VIP Customers</TabsTrigger>
          <TabsTrigger value="recent">Recent Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Customer Directory</CardTitle>
              <CardDescription>Manage your customer database</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              {customer.type === "vip" && (
                                <Badge variant="secondary" className="mt-1">
                                  VIP
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {customer.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" /> {customer.phone}
                              </div>
                            )}
                            {customer.email && (
                              <div className="flex items-center gap-1 text-sm mt-1">
                                <Mail className="h-3 w-3" /> {customer.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>₹{customer.totalSpent.toLocaleString("en-IN")}</TableCell>
                        <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => createNewBill(customer)}>
                              <FileText className="h-4 w-4 mr-1" />
                              New Bill
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(customer)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="vip">
          <Card>
            <CardHeader>
              <CardTitle>VIP Customers</CardTitle>
              <CardDescription>Your most valuable customers</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.filter((c) => c.type === "vip").length > 0 ? (
                    customers
                      .filter((c) => c.type === "vip")
                      .map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <Badge variant="secondary" className="mt-1">
                                  VIP
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              {customer.phone && (
                                <div className="flex items-center gap-1 text-sm">
                                  <Phone className="h-3 w-3" /> {customer.phone}
                                </div>
                              )}
                              {customer.email && (
                                <div className="flex items-center gap-1 text-sm mt-1">
                                  <Mail className="h-3 w-3" /> {customer.email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>₹{customer.totalSpent.toLocaleString("en-IN")}</TableCell>
                          <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => createNewBill(customer)}>
                                <FileText className="h-4 w-4 mr-1" />
                                New Bill
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => openEditDialog(customer)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No VIP customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>Customers with recent purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Last Purchase</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers
                    .filter((c) => c.lastPurchase)
                    .sort((a, b) => new Date(b.lastPurchase) - new Date(a.lastPurchase))
                    .slice(0, 5)
                    .map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{customer.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {customer.phone && (
                              <div className="flex items-center gap-1 text-sm">
                                <Phone className="h-3 w-3" /> {customer.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(customer.lastPurchase)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => createNewBill(customer)}>
                            <FileText className="h-4 w-4 mr-1" />
                            New Bill
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Customer Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>Add a new customer to your database</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer-name">Full Name</Label>
              <div className="flex items-center border rounded-md pl-3">
                <User className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="customer-name"
                  placeholder="Customer name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="border-0"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer-phone">Phone Number</Label>
                <div className="flex items-center border rounded-md pl-3">
                  <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="customer-phone"
                    placeholder="Phone number"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="border-0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customer-email">Email Address</Label>
                <div className="flex items-center border rounded-md pl-3">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="customer-email"
                    placeholder="Email address"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    className="border-0"
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-address">Address</Label>
              <div className="flex items-center border rounded-md pl-3">
                <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                <Input
                  id="customer-address"
                  placeholder="Full address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="border-0"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer-type">Customer Type</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="regular"
                    name="customer-type"
                    value="regular"
                    checked={newCustomer.type === "regular"}
                    onChange={() => setNewCustomer({ ...newCustomer, type: "regular" })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="regular" className="cursor-pointer">
                    Regular
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="vip"
                    name="customer-type"
                    value="vip"
                    checked={newCustomer.type === "vip"}
                    onChange={() => setNewCustomer({ ...newCustomer, type: "vip" })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="vip" className="cursor-pointer">
                    VIP
                  </Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomer}>Add Customer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update customer details</DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-name">Full Name</Label>
                <div className="flex items-center border rounded-md pl-3">
                  <User className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="edit-customer-name"
                    value={currentCustomer.name}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, name: e.target.value })}
                    className="border-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-customer-phone">Phone Number</Label>
                  <div className="flex items-center border rounded-md pl-3">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="edit-customer-phone"
                      value={currentCustomer.phone}
                      onChange={(e) => setCurrentCustomer({ ...currentCustomer, phone: e.target.value })}
                      className="border-0"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-customer-email">Email Address</Label>
                  <div className="flex items-center border rounded-md pl-3">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <Input
                      id="edit-customer-email"
                      value={currentCustomer.email}
                      onChange={(e) => setCurrentCustomer({ ...currentCustomer, email: e.target.value })}
                      className="border-0"
                    />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-address">Address</Label>
                <div className="flex items-center border rounded-md pl-3">
                  <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="edit-customer-address"
                    value={currentCustomer.address}
                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, address: e.target.value })}
                    className="border-0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-customer-type">Customer Type</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="edit-regular"
                      name="edit-customer-type"
                      value="regular"
                      checked={currentCustomer.type === "regular"}
                      onChange={() => setCurrentCustomer({ ...currentCustomer, type: "regular" })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="edit-regular" className="cursor-pointer">
                      Regular
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="edit-vip"
                      name="edit-customer-type"
                      value="vip"
                      checked={currentCustomer.type === "vip"}
                      onChange={() => setCurrentCustomer({ ...currentCustomer, type: "vip" })}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="edit-vip" className="cursor-pointer">
                      VIP
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentCustomer && (
            <div className="flex items-center gap-3 py-4">
              <Avatar>
                <AvatarFallback>{currentCustomer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{currentCustomer.name}</p>
                <p className="text-sm text-muted-foreground">{currentCustomer.email || currentCustomer.phone}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer}>
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

