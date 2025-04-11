"use client"

import { Check, Printer, Mail, ShoppingBag, Clock, CreditCard, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

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

export default function OrderSuccess({ orderId, onNewOrder }: { orderId: string, onNewOrder: () => void }) {
  const { toast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const restaurantId = "67e8f522404a64803d0cea8d"; // Added missing restaurantId
        const response = await fetch(`http://localhost:8000/api/v1/admin/hotel/restaurant/${restaurantId}/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch order details");
        }
        
        setOrder(data.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Error",
          description: "Failed to fetch order details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, toast]);

  // Function to handle saving an order
  // const saveOrder = async (orderData: any) => {
  //   try {
  //     const response = await fetch('http://localhost:8000/api/orders', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(orderData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to save order');
  //     }
      
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.error("Error saving order:", error);
  //     throw error;
  //   }
  // };

  const handlePrintReceipt = () => {
    // Implement receipt printing logic
    window.print();
  };

  const handleEmailReceipt = () => {
    if (!order?.customer.email) {
      toast({
        title: "No email available",
        description: "Customer email is not provided for this order.",
        variant: "destructive",
      });
      return;
    }
    // Implement email receipt logic
    console.log("Emailing receipt for order:", order);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="border-blue-100 shadow-md">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <Card className="border-blue-100 shadow-md">
          <CardHeader>
            <CardTitle className="text-red-600">Order Not Found</CardTitle>
            <CardDescription>Could not find the requested order.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={onNewOrder} className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Start New Order
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-blue-800">Order Successful!</h1>
        <p className="text-muted-foreground">Your order has been placed successfully.</p>
      </div>

      <Card className="border-blue-100 shadow-md">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="text-blue-800">Order #{order.orderNumber}</CardTitle>
          <CardDescription className="text-blue-600">{formatDate(order.orderDate)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getPaymentStatusColor(order.payment.status)}>
                  {order.payment.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Table2 className="h-4 w-4 text-blue-600" />
                <span className="text-sm">
                  {order.type === "DINE_IN" && `Dine-In ${order.tableNumber ? `(Table ${order.tableNumber})` : ''}`}
                  {order.type === "TAKEOUT" && "Takeaway"}
                  {order.type === "DELIVERY" && "Delivery"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                <span className="text-sm capitalize">{order.payment.method.toLowerCase()}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                  {item.notes && <div className="text-sm text-muted-foreground">Note: {item.notes}</div>}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      Modifiers: {item.modifiers.join(", ")}
                    </div>
                  )}
                </div>
                <div>${item.subtotal.toFixed(2)}</div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          {order.estimatedReadyTime && (
            <div className="mt-4 flex items-center gap-2 text-blue-600">
              <Clock className="h-4 w-4" />
              <span>Estimated Ready Time: {formatDate(order.estimatedReadyTime)}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1" onClick={handlePrintReceipt}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleEmailReceipt}
              disabled={!order.customer.email}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email Receipt
            </Button>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={onNewOrder}>
            <ShoppingBag className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}