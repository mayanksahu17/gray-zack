"use client"

import type React from "react"

import { useState } from "react"
import { Check, CreditCard, DollarSign, Mail, Phone, Printer, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function CheckOutView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [checkoutComplete, setCheckoutComplete] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would search the database
    // For demo purposes, we'll just set a selected guest
    setSelectedGuest(guestData)
  }

  const handleCheckout = () => {
    setCheckoutComplete(true)
  }

  const renderSearchForm = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Find Guest</CardTitle>
          <CardDescription>Search by name, room number, or reservation ID</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Enter name, room number, or reservation ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </CardContent>
      </Card>
    )
  }

  const renderCheckoutComplete = () => {
    return (
      <Card className="mx-auto max-w-md text-center">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Checkout Complete</CardTitle>
          <CardDescription>The guest has been successfully checked out</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 text-left">
            <div className="mb-2 font-medium">Checkout Summary</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Guest:</span>
                <span>Emily Davis</span>
              </div>
              <div className="flex justify-between">
                <span>Room:</span>
                <span>204</span>
              </div>
              <div className="flex justify-between">
                <span>Check-in Date:</span>
                <span>March 7, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Check-out Date:</span>
                <span>March 10, 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid:</span>
                <span>$587.25</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <Button variant="outline" className="gap-2">
              <Printer className="h-4 w-4" />
              <span>Print Receipt</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              <span>Email Receipt</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={() => {
              setSelectedGuest(null)
              setCheckoutComplete(false)
              setSearchQuery("")
            }}
          >
            New Checkout
          </Button>
        </CardFooter>
      </Card>
    )
  }

  const renderGuestCheckout = () => {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{guestData.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{guestData.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{guestData.phone}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Room:</span>
                  <span className="font-medium">{guestData.room}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Check-in:</span>
                  <span className="font-medium">{guestData.checkIn}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Check-out:</span>
                  <span className="font-medium">{guestData.checkOut}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Length of Stay:</span>
                  <span className="font-medium">{guestData.nights} Nights</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Room Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Minibar Consumption</span>
                  <span className="font-medium text-amber-600">Needs Verification</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Room Condition</span>
                  <span className="font-medium text-green-600">Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Lost Items</span>
                  <span className="font-medium text-green-600">None Reported</span>
                </div>
                <Separator />
                <div>
                  <Label htmlFor="roomNotes">Notes for Housekeeping</Label>
                  <Textarea id="roomNotes" placeholder="Add any notes for housekeeping..." />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Guest Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Overall Experience</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button key={rating} variant="outline" size="icon" className="h-8 w-8 rounded-full">
                        <Star className={`h-4 w-4 ${rating <= 4 ? "fill-primary text-primary" : ""}`} />
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="feedback">Additional Comments</Label>
                  <Textarea id="feedback" placeholder="Enter guest feedback..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="itemized">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="itemized">Itemized</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>
                <TabsContent value="itemized" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-medium">
                      <span>Room Charges</span>
                      <span></span>
                    </div>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Deluxe Queen - March 7</span>
                        <span>$159.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Deluxe Queen - March 8</span>
                        <span>$159.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Deluxe Queen - March 9</span>
                        <span>$159.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-medium">
                      <span>Food & Beverage</span>
                      <span></span>
                    </div>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Room Service - March 8</span>
                        <span>$42.50</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Restaurant - March 9</span>
                        <span>$78.25</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Minibar</span>
                        <span>$15.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-medium">
                      <span>Other Charges</span>
                      <span></span>
                    </div>
                    <div className="ml-4 space-y-1 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Spa Services</span>
                        <span>$120.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Laundry</span>
                        <span>$35.00</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Subtotal</span>
                      <span>$767.75</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taxes (12%)</span>
                      <span>$92.13</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Resort Fee</span>
                      <span>$45.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prepaid Amount</span>
                      <span className="text-red-500">-$317.63</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-bold">
                      <span>Balance Due</span>
                      <span>$587.25</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="summary" className="mt-4 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Room Charges</span>
                      <span>$477.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Food & Beverage</span>
                      <span>$135.75</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Other Charges</span>
                      <span>$155.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taxes & Fees</span>
                      <span>$137.13</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Prepaid Amount</span>
                      <span className="text-red-500">-$317.63</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between font-bold">
                      <span>Balance Due</span>
                      <span>$587.25</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="credit-card" className="space-y-3">
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="credit-card" id="checkout-credit-card" />
                  <Label htmlFor="checkout-credit-card" className="flex flex-1 items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>Credit Card on File</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="new-card" id="checkout-new-card" />
                  <Label htmlFor="checkout-new-card" className="flex flex-1 items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    <span>New Credit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border p-3">
                  <RadioGroupItem value="cash" id="checkout-cash" />
                  <Label htmlFor="checkout-cash" className="flex flex-1 items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Cash</span>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-4 rounded-lg border border-dashed p-4">
                <div className="text-sm text-muted-foreground">
                  Payment will be processed using the credit card on file:
                </div>
                <div className="mt-2 font-medium">**** **** **** 4587 (Visa)</div>
                <div className="mt-1 text-sm">Expires: 09/27</div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline">Adjust Bill</Button>
            <Button onClick={handleCheckout}>Complete Checkout</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Guest Check-out</h1>

      {!selectedGuest && !checkoutComplete && renderSearchForm()}
      {selectedGuest && !checkoutComplete && renderGuestCheckout()}
      {checkoutComplete && renderCheckoutComplete()}
    </div>
  )
}

// Sample data
const guestData = {
  id: "guest123",
  name: "Emily Davis",
  email: "emily.davis@example.com",
  phone: "+1 (555) 987-6543",
  room: "204 - Deluxe Queen",
  checkIn: "March 7, 2025",
  checkOut: "March 10, 2025",
  nights: 3,
}

