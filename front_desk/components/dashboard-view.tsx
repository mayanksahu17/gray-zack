"use client"

import { useState } from "react"
import { Bell, Calendar, CheckSquare, CreditCard, Home, LogOut, Search, Settings, Users } from "lucide-react"

import { CheckInView } from "@/components/check-in-view"
import { CheckOutView } from "@/components/check-out-view"
import { GuestHistoryView } from "@/components/guest-history-view"
import { ReportingView } from "@/components/reporting-view"
import { RoomManagementView } from "@/components/room-management-view"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import img from '../public/is_logo1 (1).webp'
export function DashboardView() {
  const [activeView, setActiveView] = useState("dashboard")

  const renderActiveView = () => {
    switch (activeView) {
      case "check-in":
        return <CheckInView />
      case "check-out":
        return <CheckOutView />
      case "guest-history":
        return <GuestHistoryView />
      case "room-management":
        return <RoomManagementView />
      case "reporting":
        return <ReportingView />
      default:
        return renderDashboard()
    }
  }

  const renderDashboard = () => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 md:flex-row">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>Today&apos;s Check-ins</CardTitle>
              <CardDescription>Guests arriving today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <div className="mt-4 space-y-2">
                {todayCheckIns.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between rounded-lg border p-2">
                    <div>
                      <div className="font-medium">{guest.name}</div>
                      <div className="text-sm text-muted-foreground">Arrival: {guest.time}</div>
                    </div>
                    <Button size="sm" onClick={() => setActiveView("check-in")}>
                      Check In
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setActiveView("check-in")}>
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>Today&apos;s Check-outs</CardTitle>
              <CardDescription>Guests departing today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <div className="mt-4 space-y-2">
                {todayCheckOuts.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between rounded-lg border p-2">
                    <div>
                      <div className="font-medium">{guest.name}</div>
                      <div className="text-sm text-muted-foreground">Room: {guest.room}</div>
                    </div>
                    <Button size="sm" onClick={() => setActiveView("check-out")}>
                      Check Out
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={() => setActiveView("check-out")}>
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>Room Status</CardTitle>
              <CardDescription>Current occupancy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-green-100 p-4 text-center dark:bg-green-900">
                  <div className="text-sm font-medium text-green-800 dark:text-green-100">Available</div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-100">24</div>
                </div>
                <div className="rounded-lg bg-red-100 p-4 text-center dark:bg-red-900">
                  <div className="text-sm font-medium text-red-800 dark:text-red-100">Occupied</div>
                  <div className="text-2xl font-bold text-red-800 dark:text-red-100">42</div>
                </div>
                <div className="rounded-lg bg-yellow-100 p-4 text-center dark:bg-yellow-900">
                  <div className="text-sm font-medium text-yellow-800 dark:text-yellow-100">Cleaning</div>
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-100">8</div>
                </div>
                <div className="rounded-lg bg-blue-100 p-4 text-center dark:bg-blue-900">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-100">Maintenance</div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-100">2</div>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full" onClick={() => setActiveView("room-management")}>
                Manage Rooms
              </Button>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle>Guest Notifications</CardTitle>
              <CardDescription>Recent requests and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-2 rounded-lg border p-2">
                    <div
                      className={`mt-0.5 h-2 w-2 rounded-full ${
                        notification.priority === "high" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <div className="font-medium">
                        Room {notification.room} - {notification.type}
                      </div>
                      <div className="text-sm text-muted-foreground">{notification.message}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{notification.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reservations</CardTitle>
            <CardDescription>Next 3 days</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tomorrow">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
                <TabsTrigger value="day2">In 2 Days</TabsTrigger>
                <TabsTrigger value="day3">In 3 Days</TabsTrigger>
              </TabsList>
              <TabsContent value="tomorrow" className="mt-4">
                <div className="space-y-2">
                  {upcomingReservations.tomorrow.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{reservation.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.roomType} - {reservation.nights} nights
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{reservation.time}</div>
                        <div className="text-sm text-muted-foreground">{reservation.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="day2" className="mt-4">
                <div className="space-y-2">
                  {upcomingReservations.day2.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{reservation.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.roomType} - {reservation.nights} nights
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{reservation.time}</div>
                        <div className="text-sm text-muted-foreground">{reservation.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="day3" className="mt-4">
                <div className="space-y-2">
                  {upcomingReservations.day3.map((reservation) => (
                    <div key={reservation.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <div className="font-medium">{reservation.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {reservation.roomType} - {reservation.nights} nights
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{reservation.time}</div>
                        <div className="text-sm text-muted-foreground">{reservation.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <SidebarProvider  >
      <div className="flex min-h-screen"  >
        <Sidebar >
        <SidebarHeader className="border-b p-4">
  <div className="flex items-center gap-2">

    <img src="https://res.cloudinary.com/dwyyrm9xw/image/upload/v1744358318/wqc4hcdz0esi42jsijro.png" alt="" className="" />
  </div>
</SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "dashboard"}
                  onClick={() => setActiveView("dashboard")}
                  className="gap-3"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "check-in"}
                  onClick={() => setActiveView("check-in")}
                  className="gap-3"
                >
                  <CheckSquare className="h-5 w-5" />
                  <span>Check In</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "check-out"}
                  onClick={() => setActiveView("check-out")}
                  className="gap-3"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Check Out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "guest-history"}
                  onClick={() => setActiveView("guest-history")}
                  className="gap-3"
                >
                  <Users className="h-5 w-5" />
                  <span>Guest History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "room-management"}
                  onClick={() => setActiveView("room-management")}
                  className="gap-3"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Room Management</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === "reporting"}
                  onClick={() => setActiveView("reporting")}
                  className="gap-3"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Reports & Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 p-1">
                  <Users className="h-full w-full text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">Front Desk</div>
                  <div className="text-xs text-muted-foreground">John Smith</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 max-w-full">
          <header className="sticky top-0 z-10 border-b bg-background">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4 md:w-1/3">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search guests, rooms, or reservations..." className="w-full pl-8" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden md:inline">Notifications</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    3
                  </span>
                </Button>
                <div className="hidden md:block">
                  <div className="text-sm font-medium">March 10, 2025</div>
                  <div className="text-xs text-muted-foreground">Monday, 5:24 PM</div>
                </div>
              </div>
            </div>
            <div className="flex border-t px-6 py-2">
              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="h-auto gap-2 rounded-lg px-6 py-3"
                  onClick={() => setActiveView("check-in")}
                >
                  <CheckSquare className="h-5 w-5" />
                  <span>Check In</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-auto gap-2 rounded-lg px-6 py-3"
                  onClick={() => setActiveView("check-out")}
                >
                  <LogOut className="h-5 w-5" />
                  <span>Check Out</span>
                </Button>
              </div>
            </div>
          </header>
          <main  className=" p-6 min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 bg-no-repeat bg-cover">{renderActiveView()}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

// Sample data
const todayCheckIns = [
  { id: 1, name: "Michael Johnson", time: "2:00 PM" },
  { id: 2, name: "Sarah Williams", time: "3:30 PM" },
  { id: 3, name: "David Brown", time: "5:45 PM" },
]

const todayCheckOuts = [
  { id: 1, name: "Emily Davis", room: "204" },
  { id: 2, name: "Robert Wilson", room: "315" },
  { id: 3, name: "Jennifer Taylor", room: "127" },
]

const notifications = [
  {
    id: 1,
    room: "302",
    type: "Maintenance Request",
    message: "AC not working properly",
    time: "10 minutes ago",
    priority: "high",
  },
  {
    id: 2,
    room: "215",
    type: "Room Service",
    message: "Extra towels requested",
    time: "25 minutes ago",
    priority: "medium",
  },
  {
    id: 3,
    room: "118",
    type: "Housekeeping",
    message: "Room ready for cleaning",
    time: "45 minutes ago",
    priority: "medium",
  },
]

const upcomingReservations = {
  tomorrow: [
    {
      id: 1,
      name: "Thomas Anderson",
      roomType: "Deluxe King",
      nights: 3,
      time: "2:00 PM",
      status: "Confirmed",
    },
    {
      id: 2,
      name: "Jessica Martinez",
      roomType: "Standard Double",
      nights: 2,
      time: "3:30 PM",
      status: "Confirmed",
    },
    {
      id: 3,
      name: "Christopher Lee",
      roomType: "Executive Suite",
      nights: 5,
      time: "4:15 PM",
      status: "Pending",
    },
  ],
  day2: [
    {
      id: 4,
      name: "Amanda Clark",
      roomType: "Deluxe Queen",
      nights: 2,
      time: "1:00 PM",
      status: "Confirmed",
    },
    {
      id: 5,
      name: "Daniel White",
      roomType: "Standard King",
      nights: 4,
      time: "2:45 PM",
      status: "Confirmed",
    },
  ],
  day3: [
    {
      id: 6,
      name: "Michelle Rodriguez",
      roomType: "Junior Suite",
      nights: 3,
      time: "12:30 PM",
      status: "Confirmed",
    },
    {
      id: 7,
      name: "Kevin Thompson",
      roomType: "Deluxe Twin",
      nights: 1,
      time: "3:00 PM",
      status: "Pending",
    },
    {
      id: 8,
      name: "Laura Garcia",
      roomType: "Standard Queen",
      nights: 2,
      time: "4:30 PM",
      status: "Confirmed",
    },
  ],
}

