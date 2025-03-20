"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2, Save, Printer, Download, UserPlus, QrCode, Check, X, Search } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { PrintInvoice } from "@/components/print-invoice"
import { useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export default function BillingPage() {
  const [items, setItems] = useState([{ id: 1, name: "Product 1", price: 100, quantity: 1, tax: 18 }])
  const [newItem, setNewItem] = useState({ name: "", price: "", quantity: "1", tax: "18" })
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", address: "" })
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [showQrDialog, setShowQrDialog] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("pending") // pending, confirmed, cancelled
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("INV-1001")
  const fileInputRef = useRef(null)
  const router = useRouter()

  const [products, setProducts] = useState([
    { id: 1, name: "Product 1", price: 100, tax: 18, category: "general", sku: "PRD001", stock: 50 },
    { id: 2, name: "Product 2", price: 200, tax: 12, category: "electronics", sku: "PRD002", stock: 25 },
    { id: 3, name: "Product 3", price: 150, tax: 5, category: "food", sku: "PRD003", stock: 100 },
    { id: 4, name: "Product 4", price: 300, tax: 28, category: "luxury", sku: "PRD004", stock: 10 },
    { id: 5, name: "Product 5", price: 50, tax: 0, category: "essentials", sku: "PRD005", stock: 200 },
  ])
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const [showProductSearch, setShowProductSearch] = useState(false)

  // Add this state to track available customers
  const [availableCustomers, setAvailableCustomers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "9876543210",
      address: "123 Main St, City, State, 400001",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "8765432109",
      address: "456 Park Ave, Town, State, 400002",
    },
    {
      id: 3,
      name: "Raj Kumar",
      email: "raj.kumar@example.com",
      phone: "7654321098",
      address: "789 Oak St, Village, State, 400003",
    },
  ])
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [filteredCustomers, setFilteredCustomers] = useState([])

  useEffect(() => {
    if (productSearchTerm) {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(productSearchTerm.toLowerCase()),
      )
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [productSearchTerm, products])

  // Add this useEffect to filter customers based on search term
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = availableCustomers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
          (customer.phone && customer.phone.includes(customerSearchTerm)) ||
          (customer.email && customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase())),
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(availableCustomers)
    }
  }, [customerSearchTerm, availableCustomers])

  const selectProduct = (product) => {
    setNewItem({
      name: product.name,
      price: product.price.toString(),
      quantity: "1",
      tax: product.tax.toString(),
    })
    setProductSearchTerm("")
    setShowProductSearch(false)
  }

  // Add this function to handle selecting a customer from the customer dialog
  const selectCustomerForBilling = (selectedCustomer) => {
    setCustomer({
      name: selectedCustomer.name,
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      address: selectedCustomer.address,
    })
    setShowCustomerDialog(false)
  }

  // Store information (would normally come from settings)
  const storeInfo = {
    name: "My Retail Store",
    address: "123 Main Street, City, State, ZIP",
    phone: "123-456-7890",
    email: "store@example.com",
    gstin: "22AAAAA0000A1Z5",
  }

  const addItem = () => {
    if (newItem.name && newItem.price) {
      setItems([
        ...items,
        {
          id: items.length + 1,
          name: newItem.name,
          price: Number.parseFloat(newItem.price),
          quantity: Number.parseInt(newItem.quantity),
          tax: Number.parseInt(newItem.tax),
        },
      ])
      setNewItem({ name: "", price: "", quantity: "1", tax: "18" })
    }
  }

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItemQuantity = (id, quantity) => {
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: Number.parseInt(quantity) } : item)))
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity * item.tax) / 100, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSaveInvoice = () => {
    // In a real application, this would save to a database
    alert("Invoice saved successfully!")
  }

  const handlePrintInvoice = () => {
    window.print()
  }

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setQrCodeUrl(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const confirmPayment = () => {
    setPaymentStatus("confirmed")
    setShowQrDialog(false)
  }

  const cancelPayment = () => {
    setPaymentStatus("cancelled")
    setShowQrDialog(false)
  }

  // Prepare invoice data for printing
  const invoiceData = {
    invoiceNumber,
    date: new Date(),
    customer,
    items,
    paymentMethod,
    subtotal: calculateSubtotal(),
    tax: calculateTax(),
    total: calculateTotal(),
  }

  const searchCustomers = () => {
    router.push("/dashboard/customers")
  }

  return (
    <>
      <div className="flex flex-col gap-4 print:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">New Bill</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowCustomerDialog(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button size="sm" onClick={handleSaveInvoice}>
              <Save className="mr-2 h-4 w-4" />
              Save Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Bill Items</CardTitle>
              <CardDescription>Add items to the bill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-end">
                  <div className="grid gap-2 flex-1 relative">
                    <Label htmlFor="item-name">Item Name</Label>
                    <Input
                      id="item-name"
                      placeholder="Enter item name or search products"
                      value={newItem.name}
                      onChange={(e) => {
                        setNewItem({ ...newItem, name: e.target.value })
                        setProductSearchTerm(e.target.value)
                        setShowProductSearch(true)
                      }}
                      onFocus={() => setShowProductSearch(true)}
                    />
                    {showProductSearch && filteredProducts.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-y-auto">
                        {filteredProducts.map((product) => (
                          <div
                            key={product.id}
                            className="p-2 hover:bg-muted cursor-pointer flex justify-between"
                            onClick={() => selectProduct(product)}
                          >
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-muted-foreground">SKU: {product.sku}</div>
                            </div>
                            <div className="text-right">
                              <div>₹{product.price}</div>
                              <div className="text-xs text-muted-foreground">Tax: {product.tax}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid gap-2 md:w-24">
                    <Label htmlFor="item-price">Price</Label>
                    <Input
                      id="item-price"
                      type="number"
                      placeholder="Price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2 md:w-24">
                    <Label htmlFor="item-quantity">Qty</Label>
                    <Input
                      id="item-quantity"
                      type="number"
                      placeholder="Qty"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2 md:w-24">
                    <Label htmlFor="item-tax">Tax %</Label>
                    <Select value={newItem.tax} onValueChange={(value) => setNewItem({ ...newItem, tax: value })}>
                      <SelectTrigger id="item-tax">
                        <SelectValue placeholder="Tax %" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="12">12%</SelectItem>
                        <SelectItem value="18">18%</SelectItem>
                        <SelectItem value="28">28%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Tax</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                              className="w-16 text-right"
                            />
                          </TableCell>
                          <TableCell className="text-right">{item.tax}%</TableCell>
                          <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {items.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground">
                            No items added yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bill Summary</CardTitle>
              <CardDescription>{customer.name ? customer.name : "No customer selected"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input id="invoice-number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>₹{calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full" onClick={() => setShowCustomerDialog(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {customer.name ? "Change Customer" : "Add Customer"}
                  </Button>
                </div>
                <div className="pt-4">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger id="payment-method" className="mt-2">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="qr">QR Payment</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentStatus !== "pending" && (
                  <div
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      paymentStatus === "confirmed"
                        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                        : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                    }`}
                  >
                    {paymentStatus === "confirmed" ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Payment confirmed</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span>Payment cancelled</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {paymentMethod === "qr" ? (
                <Button className="w-full" variant="outline" onClick={() => setShowQrDialog(true)}>
                  <QrCode className="mr-2 h-4 w-4" />
                  Show QR Code
                </Button>
              ) : null}
              <Button
                className="w-full"
                onClick={confirmPayment}
                variant={paymentStatus === "confirmed" ? "outline" : "default"}
              >
                {paymentStatus === "confirmed" ? "Payment Received" : "Confirm Payment"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Customer Dialog */}
        <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Select or Add Customer</DialogTitle>
              <DialogDescription>Select an existing customer or add a new one</DialogDescription>
            </DialogHeader>

            <div className="relative mt-2 mb-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, phone or email..."
                className="pl-8"
                value={customerSearchTerm}
                onChange={(e) => setCustomerSearchTerm(e.target.value)}
              />
            </div>

            <div className="max-h-[300px] overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {customer.phone && <div>{customer.phone}</div>}
                            {customer.email && <div className="text-muted-foreground">{customer.email}</div>}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => selectCustomerForBilling(customer)}>
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Add New Customer</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer-name">Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="Customer name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="customer-phone">Phone</Label>
                    <Input
                      id="customer-phone"
                      placeholder="Phone number"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      placeholder="Email address"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customer-address">Address</Label>
                  <Input
                    id="customer-address"
                    placeholder="Address"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => setShowCustomerDialog(false)}>Save Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* QR Code Dialog */}
        <Dialog open={showQrDialog} onOpenChange={setShowQrDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code Payment</DialogTitle>
              <DialogDescription>Scan this QR code to make payment of ₹{calculateTotal().toFixed(2)}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-4">
              {qrCodeUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="border p-4 rounded-lg">
                    <Image
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="Payment QR Code"
                      width={200}
                      height={200}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground">Amount: ₹{calculateTotal().toFixed(2)}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="border border-dashed rounded-lg p-8 w-full flex flex-col items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-center text-muted-foreground mb-4">
                      No QR code uploaded yet. Upload your payment QR code.
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleQrCodeUpload}
                      className="hidden"
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Upload QR Code
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground">Supported formats: JPG, PNG, GIF</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={cancelPayment} className="sm:order-1">
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={confirmPayment} className="sm:order-2">
                <Check className="mr-2 h-4 w-4" />
                Confirm Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Printable Invoice - Only visible when printing */}
      <PrintInvoice invoiceData={invoiceData} storeInfo={storeInfo} companyName="Your Company Name" />
    </>
  )
}

