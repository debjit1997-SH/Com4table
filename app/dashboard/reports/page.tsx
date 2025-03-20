"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText, Search } from "lucide-react"
import { format } from "date-fns"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "@/components/ui/chart"

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  // Sample data for reports
  const salesData = [
    {
      id: 1,
      date: "2023-03-15",
      invoiceNumber: "INV-1001",
      customer: "John Doe",
      customerDetails: {
        email: "john.doe@example.com",
        phone: "9876543210",
        address: "123 Main St, City, State, 400001",
      },
      items: 3,
      total: 1250,
      paymentMethod: "Cash",
      status: "completed",
    },
    {
      id: 2,
      date: "2023-03-14",
      invoiceNumber: "INV-1002",
      customer: "Jane Smith",
      customerDetails: {
        email: "jane.smith@example.com",
        phone: "8765432109",
        address: "456 Park Ave, Town, State, 400002",
      },
      items: 2,
      total: 850,
      paymentMethod: "Card",
      status: "completed",
    },
    {
      id: 3,
      date: "2023-03-13",
      invoiceNumber: "INV-1003",
      customer: "Raj Kumar",
      customerDetails: {
        email: "raj.kumar@example.com",
        phone: "7654321098",
        address: "789 Oak St, Village, State, 400003",
      },
      items: 5,
      total: 2500,
      paymentMethod: "UPI",
      status: "completed",
    },
    {
      id: 4,
      date: "2023-03-12",
      invoiceNumber: "INV-1004",
      customer: "Priya Sharma",
      customerDetails: {
        email: "priya.sharma@example.com",
        phone: "6543210987",
        address: "101 Pine St, Suburb, State, 400004",
      },
      items: 1,
      total: 450,
      paymentMethod: "Cash",
      status: "completed",
    },
    {
      id: 5,
      date: "2023-03-11",
      invoiceNumber: "INV-1005",
      customer: "Alex Johnson",
      customerDetails: {
        email: "alex.johnson@example.com",
        phone: "5432109876",
        address: "202 Maple St, District, State, 400005",
      },
      items: 4,
      total: 1800,
      paymentMethod: "QR",
      status: "completed",
    },
    {
      id: 6,
      date: "2023-03-10",
      invoiceNumber: "INV-1006",
      customer: "Sarah Williams",
      customerDetails: {
        email: "sarah.w@example.com",
        phone: "4321098765",
        address: "303 Cedar St, County, State, 400006",
      },
      items: 2,
      total: 950,
      paymentMethod: "Card",
      status: "completed",
    },
    {
      id: 7,
      date: "2023-03-09",
      invoiceNumber: "INV-1007",
      customer: "Michael Brown",
      customerDetails: {
        email: "michael.b@example.com",
        phone: "3210987654",
        address: "404 Elm St, Borough, State, 400007",
      },
      items: 3,
      total: 1350,
      paymentMethod: "Cash",
      status: "completed",
    },
    {
      id: 8,
      date: "2023-03-08",
      invoiceNumber: "INV-1008",
      customer: "Emily Davis",
      customerDetails: {
        email: "emily.d@example.com",
        phone: "2109876543",
        address: "505 Birch St, Township, State, 400008",
      },
      items: 1,
      total: 550,
      paymentMethod: "UPI",
      status: "completed",
    },
    {
      id: 9,
      date: "2023-03-07",
      invoiceNumber: "INV-1009",
      customer: "David Wilson",
      customerDetails: {
        email: "david.w@example.com",
        phone: "1098765432",
        address: "606 Spruce St, District, State, 400009",
      },
      items: 6,
      total: 2800,
      paymentMethod: "Card",
      status: "completed",
    },
    {
      id: 10,
      date: "2023-03-06",
      invoiceNumber: "INV-1010",
      customer: "Lisa Miller",
      customerDetails: {
        email: "lisa.m@example.com",
        phone: "0987654321",
        address: "707 Walnut St, City, State, 400010",
      },
      items: 2,
      total: 1050,
      paymentMethod: "Cash",
      status: "completed",
    },
  ]

  // Chart data
  const monthlySalesData = [
    { name: "Jan", sales: 12500 },
    { name: "Feb", sales: 15000 },
    { name: "Mar", sales: 18000 },
    { name: "Apr", sales: 16500 },
    { name: "May", sales: 19000 },
    { name: "Jun", sales: 22000 },
    { name: "Jul", sales: 20500 },
    { name: "Aug", sales: 23000 },
    { name: "Sep", sales: 25000 },
    { name: "Oct", sales: 27500 },
    { name: "Nov", sales: 30000 },
    { name: "Dec", sales: 35000 },
  ]

  const paymentMethodData = [
    { name: "Cash", value: 45 },
    { name: "Card", value: 25 },
    { name: "UPI", value: 20 },
    { name: "QR", value: 10 },
  ]

  const dailySalesData = [
    { name: "Mon", sales: 4500 },
    { name: "Tue", sales: 5200 },
    { name: "Wed", sales: 4800 },
    { name: "Thu", sales: 5500 },
    { name: "Fri", sales: 6200 },
    { name: "Sat", sales: 7500 },
    { name: "Sun", sales: 5800 },
  ]

  const filteredSales = salesData.filter((sale) => {
    const matchesSearch =
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      filterCategory === "all" || sale.paymentMethod.toLowerCase() === filterCategory.toLowerCase()

    const saleDate = new Date(sale.date)
    const isInDateRange = saleDate >= dateRange.from && saleDate <= dateRange.to

    return matchesSearch && matchesCategory && isInDateRange
  })

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
  const totalItems = filteredSales.reduce((sum, sale) => sum + sale.items, 0)
  const averageSale = filteredSales.length > 0 ? totalSales / filteredSales.length : 0

  const formatDate = (dateString) => {
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
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSales.toLocaleString("en-IN")}</div>
            <p className="text-xs text-muted-foreground">For the selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Items Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Across {filteredSales.length} invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{averageSale.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Per invoice</p>
          </CardContent>
        </Card>
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
          <Label>Filter by Payment Method</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="qr">QR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label>Search</Label>
          <div className="relative mt-1.5">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or invoice..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Sales Transactions</CardTitle>
              <CardDescription>Detailed view of all sales transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact & Address</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSales.length > 0 ? (
                    filteredSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{formatDate(sale.date)}</TableCell>
                        <TableCell>{sale.invoiceNumber}</TableCell>
                        <TableCell className="font-medium">{sale.customer}</TableCell>
                        <TableCell>
                          <div className="text-xs">
                            <div>{sale.customerDetails.phone}</div>
                            <div className="text-muted-foreground truncate max-w-[200px]">
                              {sale.customerDetails.address}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{sale.items}</TableCell>
                        <TableCell>{sale.paymentMethod}</TableCell>
                        <TableCell className="text-right">₹{sale.total.toLocaleString("en-IN")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="charts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Sales performance over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Sales"]}
                        labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                      />
                      <Bar dataKey="sales" fill="currentColor" className="fill-primary" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Weekly Sales</CardTitle>
                <CardDescription>Sales performance by day of week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${value / 1000}k`} />
                      <Tooltip
                        formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, "Sales"]}
                        labelStyle={{ fontWeight: "bold", marginBottom: "5px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="currentColor"
                        className="stroke-primary"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

