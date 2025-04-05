"use client"

import { useState } from "react"
import { Calendar, Download, Printer, TrendingUp, TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample sales data for charts
const salesData = {
  daily: [
    { day: "Monday", sales: 1250, orders: 42 },
    { day: "Tuesday", sales: 1420, orders: 48 },
    { day: "Wednesday", sales: 1680, orders: 56 },
    { day: "Thursday", sales: 1580, orders: 52 },
    { day: "Friday", sales: 1920, orders: 64 },
    { day: "Saturday", sales: 2150, orders: 72 },
    { day: "Sunday", sales: 1850, orders: 62 },
  ],
  monthly: [
    { month: "January", sales: 32500, orders: 1085 },
    { month: "February", sales: 29800, orders: 995 },
    { month: "March", sales: 35200, orders: 1175 },
    { month: "April", sales: 38500, orders: 1285 },
    { month: "May", sales: 42100, orders: 1405 },
    { month: "June", sales: 45800, orders: 1530 },
  ],
}

// Sample top selling items
const topSellingItems = [
  { name: "Margherita Pizza", quantity: 156, revenue: 2023.44 },
  { name: "Chicken Burger", quantity: 142, revenue: 1560.58 },
  { name: "Pasta Carbonara", quantity: 128, revenue: 1791.72 },
  { name: "Garlic Bread", quantity: 115, revenue: 574.85 },
  { name: "Soft Drink", quantity: 210, revenue: 628.9 },
]

// Sample revenue by category
const revenueByCategory = [
  { category: "Pizza", revenue: 8250.75, percentage: 28 },
  { category: "Burgers", revenue: 6120.5, percentage: 21 },
  { category: "Pasta", revenue: 4380.25, percentage: 15 },
  { category: "Appetizers", revenue: 3500.0, percentage: 12 },
  { category: "Beverages", revenue: 2920.8, percentage: 10 },
  { category: "Desserts", revenue: 2340.6, percentage: 8 },
  { category: "Others", revenue: 1750.3, percentage: 6 },
]

export default function Reports() {
  const [dateRange, setDateRange] = useState("week")
  const [reportType, setReportType] = useState("sales")

  // Calculate total sales and orders
  const totalSales = salesData.daily.reduce((sum, day) => sum + day.sales, 0)
  const totalOrders = salesData.daily.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalSales / totalOrders

  // Calculate percentage changes (dummy data for demo)
  const salesChange = 12.5
  const ordersChange = 8.2
  const avgOrderChange = 4.3

  return (
    <div className="p-6 space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Reports & Analytics</h1>
          <p className="text-muted-foreground">View and analyze your restaurant performance</p>
        </div>

        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${totalSales.toFixed(2)}</div>
            <div className="flex items-center text-xs text-blue-600">
              {salesChange > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>
                    +{salesChange}% from last {dateRange}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>
                    {salesChange}% from last {dateRange}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalOrders}</div>
            <div className="flex items-center text-xs text-blue-600">
              {ordersChange > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>
                    +{ordersChange}% from last {dateRange}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>
                    {ordersChange}% from last {dateRange}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Average Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">${avgOrderValue.toFixed(2)}</div>
            <div className="flex items-center text-xs text-blue-600">
              {avgOrderChange > 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>
                    +{avgOrderChange}% from last {dateRange}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>
                    {avgOrderChange}% from last {dateRange}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={reportType} onValueChange={setReportType} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto">
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        {/* Sales Report */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
              <CardDescription>Daily sales for the current week</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would be a chart */}
              <div className="h-80 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Sales chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Sales Distribution</CardTitle>
                <CardDescription>Sales by hour of day</CardDescription>
              </CardHeader>
              <CardContent>
                {/* In a real app, this would be a chart */}
                <div className="h-60 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Hourly sales chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Sales by payment method</CardDescription>
              </CardHeader>
              <CardContent>
                {/* In a real app, this would be a chart */}
                <div className="h-60 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Payment methods chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Items Report */}
        <TabsContent value="items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Items</CardTitle>
              <CardDescription>Items with the highest sales volume</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg. Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topSellingItems.map((item) => (
                    <TableRow key={item.name}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${item.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(item.revenue / item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Performance</CardTitle>
              <CardDescription>Sales trend by item category</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would be a chart */}
              <div className="h-80 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Item performance chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Report */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>Sales distribution across menu categories</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">% of Total</TableHead>
                    <TableHead>Distribution</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revenueByCategory.map((category) => (
                    <TableRow key={category.category}>
                      <TableCell className="font-medium">{category.category}</TableCell>
                      <TableCell className="text-right">${category.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{category.percentage}%</TableCell>
                      <TableCell>
                        <div className="w-full bg-blue-100 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Trends</CardTitle>
              <CardDescription>Performance trends by category over time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would be a chart */}
              <div className="h-80 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Category trends chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customers Report */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg. Customer Spend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42.50</div>
                <p className="text-xs text-muted-foreground">+3% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Demographics</CardTitle>
              <CardDescription>Customer distribution by age and location</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would be a chart */}
              <div className="h-80 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Customer demographics chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Retention</CardTitle>
              <CardDescription>Customer retention rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              {/* In a real app, this would be a chart */}
              <div className="h-80 w-full bg-blue-50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Customer retention chart would be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

