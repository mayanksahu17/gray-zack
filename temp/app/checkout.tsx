"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Wallet, QrCode, DollarSign, Users, Truck, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Checkout({ order, onComplete, onBack }) {
  const [diningOption, setDiningOption] = useState("dine-in")
  const [tableNumber, setTableNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  })

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    const orderDetails = {
      ...order,
      diningOption,
      tableNumber: diningOption === "dine-in" ? tableNumber : null,
      paymentMethod,
      customerDetails: diningOption === "delivery" ? customerDetails : null,
      orderNumber: Math.floor(1000 + Math.random() * 9000), // Generate random order number
      timestamp: new Date().toISOString(),
    }

    onComplete(orderDetails)
  }

  if (!order) return null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Order
      </Button>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before payment</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <div>
                        <div className="font-medium">
                          {item.quantity}x {item.name}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.size && <span>Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}</span>}
                          {item.addons && item.addons.length > 0 && <div>Add-ons: {item.addons.join(", ")}</div>}
                          {item.cookingPreference && <div>Cooking: {item.cookingPreference}</div>}
                          {item.specialInstructions && <div>Note: {item.specialInstructions}</div>}
                        </div>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription>Complete your order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Dining Option</Label>
                  <RadioGroup value={diningOption} onValueChange={setDiningOption} className="grid grid-cols-3 gap-4">
                    <div>
                      <RadioGroupItem value="dine-in" id="dine-in" className="peer sr-only" />
                      <Label
                        htmlFor="dine-in"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-blue-50 hover:text-blue-700 peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-blue-700 [&:has([data-state=checked])]:border-blue-600 [&:has([data-state=checked])]:bg-blue-50 [&:has([data-state=checked])]:text-blue-700"
                      >
                        <Users className="mb-3 h-6 w-6" />
                        Dine-In
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="takeaway" id="takeaway" className="peer sr-only" />
                      <Label
                        htmlFor="takeaway"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Home className="mb-3 h-6 w-6" />
                        Takeaway
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                      <Label
                        htmlFor="delivery"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                      >
                        <Truck className="mb-3 h-6 w-6" />
                        Delivery
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {diningOption === "dine-in" && (
                  <div className="space-y-2">
                    <Label htmlFor="table-number">Table Number</Label>
                    <Input
                      id="table-number"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="Enter table number"
                      required
                    />
                  </div>
                )}

                {diningOption === "delivery" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Name</Label>
                        <Input
                          id="customer-name"
                          value={customerDetails.name}
                          onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                          placeholder="Full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-phone">Phone</Label>
                        <Input
                          id="customer-phone"
                          value={customerDetails.phone}
                          onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                          placeholder="Phone number"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email</Label>
                      <Input
                        id="customer-email"
                        value={customerDetails.email}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                        placeholder="Email address"
                        type="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-address">Delivery Address</Label>
                      <Input
                        id="customer-address"
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })}
                        placeholder="Full address"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                    <TabsList className="grid grid-cols-4 h-auto">
                      <TabsTrigger
                        value="cash"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Cash
                      </TabsTrigger>
                      <TabsTrigger
                        value="card"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger
                        value="wallet"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Wallet
                      </TabsTrigger>
                      <TabsTrigger
                        value="qr"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        QR
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="cash" className="pt-4">
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">Payment will be collected at the counter.</p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="card" className="pt-4">
                      <Card>
                        <CardContent className="pt-4 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input id="card-number" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="wallet" className="pt-4">
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground">
                            Select your digital wallet to proceed with payment.
                          </p>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="qr" className="pt-4">
                      <Card>
                        <CardContent className="pt-4 flex justify-center">
                          <div className="w-48 h-48 bg-muted flex items-center justify-center">
                            <QrCode className="h-24 w-24 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Confirm & Pay
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}

