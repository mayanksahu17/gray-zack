"use client"

import { useState } from "react"
import { Search, Filter, Eye, Download, Printer, Calendar, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: "completed" | "pending" | "cancelled" | string; // You can refine this union if needed
  type: "dine-in" | "takeaway" | "delivery" | string;
  table?: string; // Optional, in case it's not present for takeaway/delivery
  payment: "cash" | "card" | "upi" | string;
  details: OrderItem[];
}

// Sample order data
const orders = [
  {
    id: "ORD-1001",
    customer: "Walk-in Customer",
    date: "2023-06-15 12:30 PM",
    items: 4, 
    total: 45.99,
    status: "completed",
    type: "dine-in",
    table: "5",
    payment: "cash",
    paymentId : "TXN-43546263",
    details: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Garlic Bread", quantity: 1, price: 4.99 },
      { name: "Chicken Wings", quantity: 1, price: 8.99 },
      { name: "Soft Drink", quantity: 2, price: 2.99 },
    ],
  },
  {
    id: "ORD-1002",
    customer: "Emma Johnson",
    date: "2023-06-15 01:45 PM",
    items: 3,
    total: 32.5,
    status: "completed",
    type: "takeaway",
    payment: "card",
    details: [
      { name: "Chicken Burger", quantity: 2, price: 10.99 },
      { name: "French Fries", quantity: 1, price: 3.99 },
      { name: "Iced Tea", quantity: 2, price: 3.49 },
    ],
  },
  {
    id: "ORD-1003",
    customer: "Michael Smith",
    date: "2023-06-15 02:15 PM",
    items: 5,
    total: 67.95,
    status: "completed",
    type: "delivery",
    payment: "wallet",
    details: [
      { name: "Pasta Carbonara", quantity: 2, price: 13.99 },
      { name: "Caesar Salad", quantity: 1, price: 8.99 },
      { name: "Garlic Bread", quantity: 1, price: 4.99 },
      { name: "Chocolate Cake", quantity: 1, price: 6.99 },
      { name: "Fresh Juice", quantity: 2, price: 4.99 },
    ],
  },
  {
    id: "ORD-1004",
    customer: "Sarah Williams",
    date: "2023-06-15 03:30 PM",
    items: 2,
    total: 21.98,
    status: "completed",
    type: "dine-in",
    table: "3",
    payment: "cash",
    details: [
      { name: "Margherita Pizza", quantity: 1, price: 12.99 },
      { name: "Soft Drink", quantity: 3, price: 2.99 },
    ],
  },
  {
    id: "ORD-1005",
    customer: "James Brown",
    date: "2023-06-15 04:45 PM",
    items: 4,
    total: 39.96,
    status: "completed",
    type: "takeaway",
    payment: "card",
    details: [
      { name: "Chicken Burger", quantity: 2, price: 10.99 },
      { name: "Onion Rings", quantity: 1, price: 4.49 },
      { name: "Ice Cream", quantity: 1, price: 4.99 },
      { name: "Coffee", quantity: 2, price: 3.99 },
    ],
  },
  {
    id: "ORD-1006",
    customer: "David Miller",
    date: "2023-06-15 05:30 PM",
    items: 3,
    total: 35.97,
    status: "in-progress",
    type: "dine-in",
    table: "8",
    payment: "card",
    details: [
      { name: "Grilled Salmon", quantity: 1, price: 16.99 },
      { name: "Side Salad", quantity: 1, price: 4.99 },
      { name: "Fresh Juice", quantity: 2, price: 4.99 },
    ],
  },
  {
    id: "ORD-1007",
    customer: "Jennifer Davis",
    date: "2023-06-15 06:15 PM",
    items: 5,
    total: 52.95,
    status: "in-progress",
    type: "delivery",
    payment: "wallet",
    details: [
      { name: "Pasta Carbonara", quantity: 1, price: 13.99 },
      { name: "Garlic Bread", quantity: 1, price: 4.99 },
      { name: "Chicken Wings", quantity: 1, price: 8.99 },
      { name: "Cheesecake", quantity: 1, price: 7.99 },
      { name: "Soft Drink", quantity: 2, price: 2.99 },
    ],
  },
  {
    id: "ORD-1008",
    customer: "Robert Wilson",
    date: "2023-06-15 07:00 PM",
    items: 4,
    total: 43.96,
    status: "cancelled",
    type: "takeaway",
    payment: "cash",
    details: [
      { name: "Margherita Pizza", quantity: 2, price: 12.99 },
      { name: "French Fries", quantity: 2, price: 3.99 },
      { name: "Soft Drink", quantity: 4, price: 2.99 },
    ],
  },
]

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const [selectedOrder, setSelectedOrder] = useState<Order>()

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const searchMatch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const statusMatch = statusFilter === "all" || order.status === statusFilter

    // Type filter
    const typeMatch = typeFilter === "all" || order.type === typeFilter

    // Date filter is simplified for demo purposes
    // In a real app, you would compare actual dates
    const dateMatch = true

    return searchMatch && statusMatch && typeMatch && dateMatch
  })

  // View order details
  const viewOrderDetails = (order:  any) => {
    setSelectedOrder(order)
  }

  // Get status badge color
  const getStatusBadge = (status : any) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get order type badge
  const getTypeBadge = (type : any) => {
    switch (type) {
      case "dine-in":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Dine-in
          </Badge>
        )
      case "takeaway":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Takeaway
          </Badge>
        )
      case "delivery":
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-500">
            Delivery
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  // New function to download invoice as PDF
  const downloadInvoice = (order : any) => {
    // Note: In a real application, this would typically be handled server-side
    // Here we'll create a simple JSON invoice for demonstration
    const invoice = {
      orderId: order.id,
      customer: order.customer,
      date: order.date,
      items: order.details,
      subtotal: (order.total * 0.92).toFixed(2),
      tax: (order.total * 0.08).toFixed(2),
      total: order.total.toFixed(2),
      type: order.type,
      status: order.status,
      paymentMethod: order.payment
    };

    // Create a blob of the JSON data
    const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' });
    
    // Create a link element to trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `invoice_${order.id}.json`;
    
    // Append to the document, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

   // New function to print receipt
   const printReceipt = (order : any) => {
    // Create a new window for printing
    const printWindow = window.open('', 'PRINT', 'height=800,width=600');
    
    if (!printWindow) {
      alert('Please allow popups to print the receipt');
      return;
    }

    // Generate receipt HTML
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            h1 { text-align: center; }
            .order-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .total { font-weight: bold; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Order Receipt</h1>
          <div class="order-details">
            <div>
              <strong>Order ID:</strong> ${order.id}<br>
              <strong>Customer:</strong> ${order.customer}<br>
              <strong>Date:</strong> ${order.date}
            </div>
            <div>
              <strong>Order Type:</strong> ${order.type.charAt(0).toUpperCase() + order.type.slice(1)}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.details.map((item : any) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: $${(order.total * 0.92).toFixed(2)}</p>
            <p>Tax (8%): $${(order.total * 0.08).toFixed(2)}</p>
            <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
          </div>
        </body>
      </html>
    `);

    // printWindow.document.close(); // necessary for IE >= 10
    printWindow.focus(); // necessary for IE >= 10
    printWindow.print();
    // printWindow.close();
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by order ID or customer name..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="dine-in">Dine-in</SelectItem>
              <SelectItem value="takeaway">Takeaway</SelectItem>
              <SelectItem value="delivery">Delivery</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View and manage past orders</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Order ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Date & Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Items</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Total
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getTypeBadge(order.type)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => viewOrderDetails(order)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                {selectedOrder.date} • {selectedOrder.customer}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="items">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items">Order Items</TabsTrigger>
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="payment">Payment Info</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder?.details.map((item : any, index : any) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="space-y-2 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${(selectedOrder.total * 0.92).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${(selectedOrder.total * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Order Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Order ID:</div>
                      <div>{selectedOrder.id}</div>
                      <div className="text-muted-foreground">Date & Time:</div>
                      <div>{selectedOrder.date}</div>
                      <div className="text-muted-foreground">Status:</div>
                      <div>{getStatusBadge(selectedOrder.status)}</div>
                      <div className="text-muted-foreground">Type:</div>
                      <div>{getTypeBadge(selectedOrder.type)}</div>
                      {selectedOrder.type === "dine-in" && (
                        <>
                          <div className="text-muted-foreground">Table:</div>
                          <div>{selectedOrder.table}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Name:</div>
                      <div>{selectedOrder.customer}</div>
                      <div className="text-muted-foreground">Phone:</div>
                      <div>+1 (555) 123-4567</div>
                      {selectedOrder.type === "delivery" && (
                        <>
                          <div className="text-muted-foreground">Address:</div>
                          <div>123 Main St, Anytown, CA 12345</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Payment Method:</div>
                    <div className="capitalize">{selectedOrder.payment}</div>
                    <div className="text-muted-foreground">Payment Status:</div>
                    <div>
                      <Badge className="bg-green-500">Paid</Badge>
                    </div>
                    <div className="text-muted-foreground">Transaction ID:</div>
                    <div>TXN-{Math.floor(100000 + Math.random() * 900000)}</div>
                    <div className="text-muted-foreground">Payment Date:</div>
                    <div>{selectedOrder.date}</div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => printReceipt(selectedOrder)}
              >
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button 
                onClick={() => downloadInvoice(selectedOrder)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Invoice
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

