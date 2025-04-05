"use client"

import { Check, Printer, Mail, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

export default function OrderSuccess({ order, onNewOrder } : any) {
  const { toast } = useToast()

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const response = await fetch('https://8tvnlx2t-8000.inc1.devtunnels.ms/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: order.items.map((item: any) => ({
              menuItem: item.id,
              quantity: item.quantity,
              price: item.price,
              notes: item.notes || ''
            })),
            orderType: order.diningOption,
            orderSource: 'server',
            table: order.tableNumber,
            subtotal: order.subtotal,
            tax: order.tax,
            total: order.total,
            paymentMethod: order.paymentMethod,
            paymentStatus: 'paid',
            status: 'pending'
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save order')
        }

        toast({
          title: "Order Saved",
          description: "The order has been saved to the database.",
        })
      } catch (error) {
        console.error('Error saving order:', error)
        toast({
          title: "Error",
          description: "Failed to save the order. Please try again.",
          variant: "destructive",
        })
      }
    }

    if (order) {
      saveOrder()
    }
  }, [order, toast])

  if (!order) return null

  // Format date for receipt
  const formatDate = (dateString : any) => {
    const date = dateString ? new Date(dateString) : new Date()
    return date.toLocaleString()
  }

  // Estimated time (random between 15-30 minutes)
  const estimatedMinutes = Math.floor(Math.random() * 16) + 15

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <Check className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold">Order Successful!</h1>
        <p className="text-muted-foreground">Your order has been placed successfully.</p>
      </div>

      <Card className="border-blue-100 shadow-md">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
          <CardTitle className="text-blue-800">Order #{order.orderNumber}</CardTitle>
          <CardDescription className="text-blue-600">{formatDate(order.timestamp)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="font-medium">Estimated Time:</div>
            <div className="text-lg">{estimatedMinutes} minutes</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-medium">Dining Option:</div>
            <div>
              {order.diningOption === "dine-in" && `Dine-In (Table ${order.tableNumber})`}
              {order.diningOption === "takeaway" && "Takeaway"}
              {order.diningOption === "delivery" && "Delivery"}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="font-medium">Payment Method:</div>
            <div className="capitalize">{order.paymentMethod}</div>
          </div>

          <Separator />

          <div className="space-y-2">
            {order.items.map((item : any, index : any) => (
              <div key={index} className="flex justify-between">
                <div>
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                  {item.size && ` (${item.size.charAt(0).toUpperCase() + item.size.slice(1)})`}
                </div>
                <div>${(item.price * item.quantity).toFixed(2)}</div>
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
            {order.discount > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="flex gap-4 w-full">
            <Button variant="outline" className="flex-1">
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" className="flex-1">
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
  )
}

