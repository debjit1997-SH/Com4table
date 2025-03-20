"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Search, Printer, Eye, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { PrintInvoice } from "@/components/print-invoice"

export default function InvoicesPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("desc")
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  // Sample data for invoices
  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-1001",
      date: "2023-03-15",
      customer: { name: "John Doe", email: "john.doe@example.com", phone: "9876543210", address: "123 Main St, City" },
      items: [
        { name: "Product 1", price: 500, quantity: 2, tax: 18 },
        { name: "Product 2", price: 250, quantity: 1, tax: 12 },
      ],
      subtotal: 1250,
      tax: 225,
      total: 1475,
      paymentMethod: "Cash",
      status: "paid",
    },
    {
      id: 2,
      invoiceNumber: "INV-1002",
      date: "2023-03-14",
      customer: {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "8765432109",
        address: "456 Park Ave, Town",
      },
      items: [
        { name: "Product 3", price: 750, quantity: 1, tax: 18 },
        { name: "Product 4", price: 100, quantity: 1, tax: 5 },
      ],
      subtotal: 850,
      tax: 140,
      total: 990,
      paymentMethod: "Card",
      status: "paid",
    },
    {
      id: 3,
      invoiceNumber: "INV-1003",
      date: "2023-03-13",
      customer: {
        name: "Raj Kumar",
        email: "raj.kumar@example.com",
        phone: "7654321098",
        address: "789 Oak St, Village",
      },
      items: [
        { name: "Product 5", price: 1200, quantity: 2, tax: 18 },
        { name: "Product 6", price: 100, quantity: 1, tax: 5 },
      ],
      subtotal: 2500,
      tax: 437,
      total: 2937,
      paymentMethod: "UPI",
      status: "paid",
    },
    {
      id: 4,
      invoiceNumber: "INV-1004",
      date: "2023-03-12",
      customer: {
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "6543210987",
        address: "101 Pine St, Suburb",
      },
      items: [{ name: "Product 7", price: 450, quantity: 1, tax: 12 }],
      subtotal: 450,
      tax: 54,
      total: 504,
      paymentMethod: "Cash",
      status: "paid",
    },
    {
      id: 5,
      invoiceNumber: "INV-1005",
      date: "2023-03-11",
      customer: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "5432109876",
        address: "202 Maple St, District",
      },
      items: [
        { name: "Product 8", price: 800, quantity: 2, tax: 18 },
        { name: "Product 9", price: 200, quantity: 1, tax: 5 },
      ],
      subtotal: 1800,
      tax: 298,
      total: 2098,
      paymentMethod: "QR",
      status: "pending",
    },
    {
      id: 6,
      invoiceNumber: "INV-1006",
      date: "2023-03-10",
      customer: {
        name: "Sarah Williams",
        email: "sarah.w@example.com",
        phone: "4321098765",
        address: "303 Cedar St, County",
      },
      items: [{ name: "Product 10", price: 950, quantity: 1, tax: 18 }],
      subtotal: 950,
      tax: 171,
      total: 1121,
      paymentMethod: "Card",
      status: "paid",
    },
    {
      id: 7,
      invoiceNumber: "INV-1007",
      date: "2023-03-09",
      customer: {
        name: "Michael Brown",
        email: "michael.b@example.com",
        phone: "3210987654",
        address: "404 Elm St, Borough",
      },
      items: [
        { name: "Product 11", price: 350, quantity: 3, tax: 12 },
        { name: "Product 12", price: 300, quantity: 1, tax: 5 },
      ],
      subtotal: 1350,
      tax: 141,
      total: 1491,
      paymentMethod: "Cash",
      status: "paid",
    },
    {
      id: 8,
      invoiceNumber: "INV-1008",
      date: "2023-03-08",
      customer: {
        name: "Emily Davis",
        email: "emily.d@example.com",
        phone: "2109876543",
        address: "505 Birch St, Township",
      },
      items: [{ name: "Product 13", price: 550, quantity: 1, tax: 18 }],
      subtotal: 550,
      tax: 99,
      total: 649,
      paymentMethod: "UPI",
      status: "cancelled",
    },
    {
      id: 9,
      invoiceNumber: "INV-1009",
      date: "2023-03-07",
      customer: {
        name: "David Wilson",
        email: "david.w@example.com",
        phone: "1098765432",
        address: "606 Spruce St, District",
      },
      items: [
        { name: "Product 14", price: 1200, quantity: 2, tax: 18 },
        { name: "Product 15", price: 400, quantity: 1, tax: 5 },
      ],
      subtotal: 2800,
      tax: 452,
      total: 3252,
      paymentMethod: "Card",
      status: "paid",
    },
    {
      id: 10,
      invoiceNumber: "INV-1010",
      date: "2023-03-06",
      customer: {
        name: "Lisa Miller",
        email: "lisa.m@example.com",
        phone: "0987654321",
        address: "707 Walnut St, City",
      },
      items: [{ name: "Product 16", price: 1050, quantity: 1, tax: 12 }],
      subtotal: 1050,
      tax: 126,
      total: 1176,
      paymentMethod: "Cash",
      status: "paid",
    },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    const invoiceDate = new Date(invoice.date)
    const isInDateRange = invoiceDate >= dateRange.from && invoiceDate <= dateRange.to

    return matchesSearch && matchesStatus && isInDateRange
  })

  const sortedInvoices = [...filteredInvoices].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return sortOrder === "desc" ? dateB - dateA : dateA - dateB
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Paid</Badge>
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>
        )
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setShowInvoiceDialog(true)
  }

  const printInvoice = (invoice) => {
    setSelectedInvoice(invoice)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc")
  }

  // Store information (would normally come from settings)
  const storeInfo = {
    name: "My Retail Store",
    address: "123 Main Street, City, State, ZIP",
    phone: "123-456-7890",
    email: "store@example.com",
    gstin: "22AAAAA0000A1Z5",
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Invoices
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label>Date Range</Label>
          <div className="flex items-center mt-1.5">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
                      </>
                    ) : (
                      format(dateRange.from, "PPP")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to })
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex-1">
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Search</Label>
          <div className="relative mt-1.5">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by invoice # or customer..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View and manage all your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 font-medium" onClick={toggleSortOrder}>
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvoices.length > 0 ? (
                sortedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell>{invoice.customer.name}</TableCell>
                    <TableCell>{invoice.paymentMethod}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">₹{invoice.total.toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => viewInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => printInvoice(invoice)}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No invoices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invoice View Dialog */}
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>{selectedInvoice && `Invoice #${selectedInvoice.invoiceNumber}`}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">Bill To:</h3>
                  <p>{selectedInvoice.customer.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.customer.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.customer.phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedInvoice.customer.address}</p>
                </div>
                <div className="text-right">
                  <h3 className="font-semibold">Invoice Details:</h3>
                  <p>Date: {formatDate(selectedInvoice.date)}</p>
                  <p>Status: {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}</p>
                  <p>Payment: {selectedInvoice.paymentMethod}</p>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedInvoice.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">₹{item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.tax}%</TableCell>
                        <TableCell className="text-right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{selectedInvoice.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₹{selectedInvoice.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total:</span>
                    <span>₹{selectedInvoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
              Close
            </Button>
            <Button onClick={() => printInvoice(selectedInvoice)}>
              <Printer className="mr-2 h-4 w-4" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Printable Invoice - Only visible when printing */}
      {selectedInvoice && (
        <PrintInvoice
          invoiceData={{
            invoiceNumber: selectedInvoice.invoiceNumber,
            date: new Date(selectedInvoice.date),
            customer: selectedInvoice.customer,
            items: selectedInvoice.items,
            paymentMethod: selectedInvoice.paymentMethod,
            subtotal: selectedInvoice.subtotal,
            tax: selectedInvoice.tax,
            total: selectedInvoice.total,
          }}
          storeInfo={storeInfo}
          companyName="Your Company Name"
        />
      )}
    </div>
  )
}

