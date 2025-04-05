"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, CreditCard, Filter, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GuestHistoryView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGuest, setSelectedGuest] = useState<any>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would search the database
    // For demo purposes, we'll just set a selected guest
    setSelectedGuest(guestData)
  }

  const renderSearchForm = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Find Guest</CardTitle>
          <CardDescription>Search by name, email, phone, or ID</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Enter name, email, phone, or ID"
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

  const renderGuestDetails = () => {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Guest Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                </div>
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
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>Visa **** 4587</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Member Since:</span>
                    <span className="font-medium">June 2023</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Loyalty Status:</span>
                    <span className="font-medium text-primary">Gold</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Loyalty Points:</span>
                    <span className="font-medium">2,450</span>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Guest Preferences</div>
                  <div className="rounded-md bg-muted p-3 text-sm">
                    <ul className="space-y-1">
                      <li>Prefers high floor rooms</li>
                      <li>Allergic to feather pillows</li>
                      <li>Early check-in when available</li>
                      <li>Prefers room away from elevator</li>
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Edit Information
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Tabs defaultValue="stays">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stays">Stay History</TabsTrigger>
              <TabsTrigger value="billing">Billing History</TabsTrigger>
              <TabsTrigger value="notes">Notes & Requests</TabsTrigger>
            </TabsList>
            <TabsContent value="stays" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Showing {stayHistory.length} previous stays</div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
              <div className="space-y-4">
                {stayHistory.map((stay) => (
                  <Card key={stay.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col justify-between gap-4 md:flex-row">
                        <div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {stay.checkIn} - {stay.checkOut}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {stay.nights} nights · Room {stay.room} · {stay.roomType}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {stay.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${stay.totalSpent.toFixed(2)}</div>
                          <div className="mt-1 text-sm text-muted-foreground">Total Spent</div>
                          <Button variant="outline" size="sm" className="mt-3">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="billing" className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Showing billing history for all stays</div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="room">Room Charges</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="services">Additional Services</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 border-b bg-muted p-3 text-sm font-medium">
                  <div className="col-span-2">Description</div>
                  <div>Date</div>
                  <div>Payment Method</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y">
                  {billingHistory.map((item) => (
                    <div key={item.id} className="grid grid-cols-5 p-3 text-sm">
                      <div className="col-span-2">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                      <div className="flex items-center">{item.date}</div>
                      <div className="flex items-center">{item.paymentMethod}</div>
                      <div className="flex items-center justify-end font-medium">${item.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="notes" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Special Requests & Notes</CardTitle>
                  <CardDescription>History of special requests and staff notes for this guest</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {guestNotes.map((note) => (
                      <div key={note.id} className="rounded-lg border p-3">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{note.title}</div>
                          <div className="text-sm text-muted-foreground">{note.date}</div>
                        </div>
                        <div className="mt-1 text-sm">{note.content}</div>
                        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="font-medium">Added by:</span> {note.staff}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button>Add New Note</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Guest History</h1>

      {!selectedGuest && renderSearchForm()}
      {selectedGuest && renderGuestDetails()}
    </div>
  )
}

// Sample data
const guestData = {
  id: "guest123",
  name: "Emily Davis",
  email: "emily.davis@example.com",
  phone: "+1 (555) 987-6543",
}

const stayHistory = [
  {
    id: "stay1",
    checkIn: "Mar 7, 2025",
    checkOut: "Mar 10, 2025",
    nights: 3,
    room: "204",
    roomType: "Deluxe Queen",
    totalSpent: 587.25,
    tags: ["Current Stay", "Gold Member"],
  },
  {
    id: "stay2",
    checkIn: "Jan 15, 2025",
    checkOut: "Jan 18, 2025",
    nights: 3,
    room: "315",
    roomType: "Deluxe King",
    totalSpent: 642.75,
    tags: ["Business Trip", "Late Checkout"],
  },
  {
    id: "stay3",
    checkIn: "Nov 22, 2024",
    checkOut: "Nov 26, 2024",
    nights: 4,
    room: "402",
    roomType: "Junior Suite",
    totalSpent: 978.5,
    tags: ["Holiday", "Spa Package"],
  },
  {
    id: "stay4",
    checkIn: "Aug 5, 2024",
    checkOut: "Aug 7, 2024",
    nights: 2,
    room: "210",
    roomType: "Standard Queen",
    totalSpent: 329.8,
    tags: ["Weekend Stay"],
  },
]

const billingHistory = [
  {
    id: "bill1",
    description: "Room Charge - Deluxe Queen",
    category: "Room #204",
    date: "Mar 10, 2025",
    paymentMethod: "Visa **** 4587",
    amount: 477.0,
  },
  {
    id: "bill2",
    description: "Restaurant Dinner",
    category: "Food & Beverage",
    date: "Mar 9, 2025",
    paymentMethod: "Room Charge",
    amount: 78.25,
  },
  {
    id: "bill3",
    description: "Spa Services",
    category: "Additional Services",
    date: "Mar 8, 2025",
    paymentMethod: "Room Charge",
    amount: 120.0,
  },
  {
    id: "bill4",
    description: "Room Service",
    category: "Food & Beverage",
    date: "Mar 8, 2025",
    paymentMethod: "Room Charge",
    amount: 42.5,
  },
  {
    id: "bill5",
    description: "Laundry Service",
    category: "Additional Services",
    date: "Mar 9, 2025",
    paymentMethod: "Room Charge",
    amount: 35.0,
  },
  {
    id: "bill6",
    description: "Minibar Consumption",
    category: "Food & Beverage",
    date: "Mar 10, 2025",
    paymentMethod: "Room Charge",
    amount: 15.0,
  },
]

const guestNotes = [
  {
    id: "note1",
    title: "Early Check-in Request",
    content: "Guest has requested early check-in for their next stay if possible. Prefers arrival around 11:00 AM.",
    date: "Mar 10, 2025",
    staff: "John Smith",
  },
  {
    id: "note2",
    title: "Pillow Preference",
    content: "Guest is allergic to feather pillows. Always provide hypoallergenic pillows.",
    date: "Jan 18, 2025",
    staff: "Maria Johnson",
  },
  {
    id: "note3",
    title: "Room Location",
    content: "Guest prefers rooms on higher floors away from elevator. Noise sensitive.",
    date: "Nov 26, 2024",
    staff: "Robert Wilson",
  },
  {
    id: "note4",
    title: "Anniversary",
    content: "Guest mentioned their anniversary is on July 15. Consider special amenities for stays around this date.",
    date: "Aug 7, 2024",
    staff: "Sarah Williams",
  },
]

