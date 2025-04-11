"use client"

import { useState } from "react"
import { ArrowLeft, CreditCard, Wallet, QrCode, DollarSign, Users, Truck, Home, X, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
// import { BASE_URL as API_BASE_URL } from "@/lib/constants"

export default function Checkout({ order, onComplete, onBack } : any) {
  const [diningOption, setDiningOption] = useState("dine-in")
  const [tableNumber, setTableNumber] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false)
  const [tables, setTables] = useState([])
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  })
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false)
  const { toast } = useToast()

  // Function to fetch tables data

  const fetchTables = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/admin/hotel/restaurant/67e8f522404a64803d0cea8d/tables",
      )
      const data = await response.json()
      if (data.success) {
        setTables(data.data)
      }
    } catch (error) {
      console.error("Error fetching tables:", error)
      toast({
        title: "Error",
        description: "Failed to fetch available tables. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Handle opening the table selection dialog
  const handleOpenTableDialog = () => {
    fetchTables()
    setIsTableDialogOpen(true)
  }

  // Handle table selection
  const handleSelectTable = (tableNum : any) => {
    setTableNumber(tableNum)
    setIsTableDialogOpen(false)
  }
  
  // Process payment and create order
  const processPayment = async (orderDetails: any) => {
    setIsProcessing(true);
    try {
      // 1. Process payment
      const paymentResponse = await fetch("http://localhost:8000/api/restaurants/payments/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: orderDetails.orderId,
          amount: orderDetails.total,
          currency: "USD",
          paymentMethod: orderDetails.paymentMethod,
          cardDetails: paymentMethod === "card" ? cardDetails : null,
        }),
      });
      
      const paymentData = await paymentResponse.json();
      
      if (!paymentData.success) {
        throw new Error(paymentData.message || "Payment processing failed");
      }
      
      // 2. Create order with payment information
      const orderResponse = await fetch(`http://localhost:8000/api/restaurants/67e8f522404a64803d0cea8d/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          customer: {
            name: customerInfo.name,
            phone: customerInfo.phone,
            email: customerInfo.email,
            address: customerInfo.address
          },
          items: orderDetails.items.map((item: any) => ({
            itemId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes,
            modifiers: item.modifiers,
            subtotal: item.price * item.quantity
          })),
          tableNumber: diningOption === "dine-in" ? tableNumber : undefined,
          type: diningOption.toUpperCase(),
          paymentMethod: paymentMethod.toUpperCase(),
          specialInstructions: orderDetails.specialInstructions,
          payment: {
            method: paymentMethod.toLowerCase(),
            status: "PAID",
            amount: orderDetails.total,
            tax: orderDetails.tax,
            tip: orderDetails.tip || 0,
            transactionId: paymentData.data.transactionId
          }
        }),
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || "Order creation failed");
      }
      
      setIsPaymentSuccessful(true);
      
      // Short delay to show success state before completing
      setTimeout(() => {
        onComplete({
          ...orderDetails,
          orderId: orderData.data._id,
          orderNumber: orderData.data.orderNumber,
          paymentId: paymentData.data.paymentId,
          paymentStatus: paymentData.data.status,
          transactionId: paymentData.data.transactionId,
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate customer info
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least name and phone number",
        variant: "destructive",
      });
      return;
    }

    const orderDetails = {
      ...order,
      customer: customerInfo,
      diningOption,
      tableNumber: diningOption === "dine-in" ? tableNumber : null,
      paymentMethod,
      orderNumber: Math.floor(1000 + Math.random() * 9000), // Generate random order number
      timestamp: new Date().toISOString(),
    };

    await processPayment(orderDetails);
  };

  // Handle card detail changes
  const handleCardDetailChange = (field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!order) return null

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6" disabled={isProcessing}>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customer-name">Name *</Label>
                      <Input
                        id="customer-name"
                        placeholder="Enter customer name"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-phone">Phone *</Label>
                      <Input
                        id="customer-phone"
                        placeholder="Enter phone number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email</Label>
                      <Input
                        id="customer-email"
                        type="email"
                        placeholder="Enter email address"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-address">Address</Label>
                      <Input
                        id="customer-address"
                        placeholder="Enter delivery address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dining Option</Label>
                  <RadioGroup 
                    value={diningOption} 
                    onValueChange={setDiningOption} 
                    className="grid grid-cols-3 gap-4"
                    disabled={isProcessing}
                  >
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
                    <div className="flex gap-2 items-center">
                      <Button 
                        type="button" 
                        onClick={handleOpenTableDialog} 
                        className="flex-1" 
                        variant="outline"
                        disabled={isProcessing}
                      >
                        {tableNumber ? `Table ${tableNumber}` : "Select a Table"}
                      </Button>
                      {tableNumber && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setTableNumber("")}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <Dialog open={isTableDialogOpen} onOpenChange={setIsTableDialogOpen}>
                      <DialogContent className="max-w-3xl max-h-[80vh]">
                        <DialogHeader>
                          <DialogTitle>Select a Table</DialogTitle>
                          <DialogDescription>Choose an available table from the floor plan</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[500px] pr-4">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                            {tables.map((table) => (
                              <div
                                key={table._id}
                                onClick={() => table.status === "available" && handleSelectTable(table.tableNumber)}
                                className={`
                                  relative p-4 border-2 rounded-lg transition-all
                                  ${table.status === "available" 
                                    ? "border-green-500 hover:bg-green-50 cursor-pointer" 
                                    : "border-red-300 bg-red-50 cursor-not-allowed"}
                                `}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-bold text-lg">{table.tableNumber}</h3>
                                    <p className="text-sm text-muted-foreground">{table.location}</p>
                                  </div>
                                  <Badge variant={table.status === "available" ? "outline" : "destructive"}>
                                    {table.status}
                                  </Badge>
                                </div>
                                <div className="mt-2">
                                  <p className="text-sm">Capacity: {table.capacity} people</p>
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {table.features.map((feature, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {feature}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                {table.status === "available" && (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-green-500/10 rounded-lg">
                                    <Button size="sm">Select</Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                        <div className="flex justify-end gap-2">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {diningOption === "delivery" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Name</Label>
                        <Input
                          id="customer-name"
                          value={customerInfo.name}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                          placeholder="Full name"
                          required
                          disabled={isProcessing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-phone">Phone</Label>
                        <Input
                          id="customer-phone"
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                          placeholder="Phone number"
                          required
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email</Label>
                      <Input
                        id="customer-email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        placeholder="Email address"
                        type="email"
                        disabled={isProcessing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-address">Delivery Address</Label>
                      <Input
                        id="customer-address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                        placeholder="Full address"
                        required
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Tabs value={paymentMethod} onValueChange={setPaymentMethod} disabled={isProcessing}>
                    <TabsList className="grid grid-cols-4 h-auto">
                      <TabsTrigger
                        value="cash"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        disabled={isProcessing}
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Cash
                      </TabsTrigger>
                      <TabsTrigger
                        value="card"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        disabled={isProcessing}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger
                        value="wallet"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        disabled={isProcessing}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        Wallet
                      </TabsTrigger>
                      <TabsTrigger
                        value="qr"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                        disabled={isProcessing}
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
                            <Input 
                              id="card-number" 
                              placeholder="1234 5678 9012 3456" 
                              value={cardDetails.cardNumber}
                              onChange={(e) => handleCardDetailChange('cardNumber', e.target.value)}
                              disabled={isProcessing}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2 col-span-2">
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input 
                                id="expiry" 
                                placeholder="MM/YY" 
                                value={cardDetails.expiryDate}
                                onChange={(e) => handleCardDetailChange('expiryDate', e.target.value)}
                                disabled={isProcessing}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input 
                                id="cvv" 
                                placeholder="123" 
                                value={cardDetails.cvv}
                                onChange={(e) => handleCardDetailChange('cvv', e.target.value)}
                                disabled={isProcessing}
                              />
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
                          <div className="grid grid-cols-3 gap-2 mt-4">
                            <Button variant="outline" className="flex items-center justify-center h-14" disabled={isProcessing}>
                              Apple Pay
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center h-14" disabled={isProcessing}>
                              Google Pay
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center h-14" disabled={isProcessing}>
                              PayPal
                            </Button>
                          </div>
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isProcessing || isPaymentSuccessful}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isPaymentSuccessful ? "Payment Successful" : "Processing Payment..."}
                    </>
                  ) : isPaymentSuccessful ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Payment Successful
                    </>
                  ) : (
                    "Confirm & Pay"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}