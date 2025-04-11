"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/components/ui/use-toast"

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  modifiers?: string[];
  subtotal: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  items: OrderItem[];
  status: string;
  type: string;
  tableNumber?: string;
  subtotal: number;
  tax: number;
  total: number;
  payment: {
    method: string;
    status: string;
    amount: number;
    transactionId?: string;
    paymentDate?: string;
  };
  orderDate: string;
  estimatedReadyTime?: string;
}

export default function OrderHistory({ restaurantId }: { restaurantId: string }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/v1/admin/hotel/restaurant/67e8f522404a64803d0cea8d/orders`, {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch orders")
        }
        
        setOrders(data.data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchOrders()
  }, [toast]) // Removed restaurantId from dependencies since it's now hardcoded

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const searchMatch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())

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
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order)
  }

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <Badge className="bg-green-500">Completed</Badge>
      case "PENDING":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "PREPARING":
        return <Badge className="bg-blue-500">Preparing</Badge>
      case "READY":
        return <Badge className="bg-purple-500">Ready</Badge>
      case "CANCELLED":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get order type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "DINE_IN":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Dine-in
          </Badge>
        )
      case "TAKEOUT":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-500">
            Takeaway
          </Badge>
        )
      case "DELIVERY":
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
  const downloadInvoice = (order: Order) => {
    // Note: In a real application, this would typically be handled server-side
    // Here we'll create a simple JSON invoice for demonstration
    const invoice = {
      orderId: order._id,
      orderNumber: order.orderNumber,
      customer: order.customer,
      date: order.orderDate,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      type: order.type,
      status: order.status,
      paymentMethod: order.payment.method
    }

    // Create a blob of the JSON data
    const blob = new Blob([JSON.stringify(invoice, null, 2)], { type: 'application/json' })
    
    // Create a link element to trigger download
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `invoice_${order.orderNumber}.json`
    
    // Append to the document, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // New function to print receipt
  const printReceipt = (order: Order) => {
    // Create a new window for printing
    const printWindow = window.open('', 'PRINT', 'height=800,width=600')
    
    if (!printWindow) {
      alert('Please allow popups to print the receipt')
      return
    }

    // Generate receipt HTML
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${order.orderNumber}</title>
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
              <strong>Order ID:</strong> ${order.orderNumber}<br>
              <strong>Customer:</strong> ${order.customer.name}<br>
              <strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}
            </div>
            <div>
              <strong>Order Type:</strong> ${order.type.replace('_', ' ')}
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
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>$${item.subtotal.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">
            <p>Subtotal: $${order.subtotal.toFixed(2)}</p>
            <p>Tax: $${order.tax.toFixed(2)}</p>
            <p><strong>Total: $${order.total.toFixed(2)}</strong></p>
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  if (isLoading) {
    return <div>Loading...</div>
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
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="PREPARING">Preparing</SelectItem>
              <SelectItem value="READY">Ready</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="DINE_IN">Dine-in</SelectItem>
              <SelectItem value="TAKEOUT">Takeaway</SelectItem>
              <SelectItem value="DELIVERY">Delivery</SelectItem>
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
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">{order.orderNumber}</TableCell>
                    <TableCell>{order.customer.name}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
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
              <DialogTitle>Order Details - {selectedOrder.orderNumber}</DialogTitle>
              <DialogDescription>
                {new Date(selectedOrder.orderDate).toLocaleString()} • {selectedOrder.customer.name}
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
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {item.name}
                          {item.notes && <div className="text-sm text-muted-foreground">Note: {item.notes}</div>}
                          {item.modifiers && item.modifiers.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              Modifiers: {item.modifiers.join(", ")}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.subtotal.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="space-y-2 border-t pt-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${selectedOrder.tax.toFixed(2)}</span>
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
                      <div>{selectedOrder.orderNumber}</div>
                      <div className="text-muted-foreground">Date & Time:</div>
                      <div>{new Date(selectedOrder.orderDate).toLocaleString()}</div>
                      <div className="text-muted-foreground">Status:</div>
                      <div>{getStatusBadge(selectedOrder.status)}</div>
                      <div className="text-muted-foreground">Type:</div>
                      <div>{getTypeBadge(selectedOrder.type)}</div>
                      {selectedOrder.type === "DINE_IN" && (
                        <>
                          <div className="text-muted-foreground">Table:</div>
                          <div>{selectedOrder.tableNumber}</div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Customer Information</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Name:</div>
                      <div>{selectedOrder.customer.name}</div>
                      {selectedOrder.customer.phone && (
                        <>
                          <div className="text-muted-foreground">Phone:</div>
                          <div>{selectedOrder.customer.phone}</div>
                        </>
                      )}
                      {selectedOrder.customer.email && (
                        <>
                          <div className="text-muted-foreground">Email:</div>
                          <div>{selectedOrder.customer.email}</div>
                        </>
                      )}
                      {selectedOrder.customer.address && (
                        <>
                          <div className="text-muted-foreground">Address:</div>
                          <div>{selectedOrder.customer.address}</div>
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
                    <div className="capitalize">{selectedOrder.payment.method.toLowerCase()}</div>
                    <div className="text-muted-foreground">Payment Status:</div>
                    <div>
                      <Badge className="bg-green-500">Paid</Badge>
                    </div>
                    {selectedOrder.payment.transactionId && (
                      <>
                        <div className="text-muted-foreground">Transaction ID:</div>
                        <div>{selectedOrder.payment.transactionId}</div>
                      </>
                    )}
                    {selectedOrder.payment.paymentDate && (
                      <>
                        <div className="text-muted-foreground">Payment Date:</div>
                        <div>{new Date(selectedOrder.payment.paymentDate).toLocaleString()}</div>
                      </>
                    )}
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

