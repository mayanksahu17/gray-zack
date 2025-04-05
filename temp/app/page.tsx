"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Clock, ShoppingBag, History, Package2, BarChart3, Settings, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Dashboard from "./dashboard"
import NewOrder from "./new-order"
import Checkout from "./checkout"
import OrderSuccess from "./order-success"
import OrderHistory from "./order-history"
import Inventory from "./inventory"
import Reports from "./reports"
import SettingsPage from "./settings"

export default function RestaurantPOS() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState("dashboard")
  const [currentOrder, setCurrentOrder] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Function to handle screen navigation
  const navigateTo = (screen) => {
    setCurrentScreen(screen)
  }

  // Function to handle order creation and updates
  const handleOrder = (order) => {
    setCurrentOrder(order)
    navigateTo("checkout")
  }

  // Function to handle order completion
  const completeOrder = (orderDetails) => {
    // In a real app, this would save the order to a database
    navigateTo("success")
  }

  // Function to start a new order
  const startNewOrder = () => {
    setCurrentOrder(null)
    navigateTo("new-order")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col items-center py-6 shadow-lg">
        <div className="mb-8">
          <div className="w-12 h-12 rounded-full bg-primary-foreground flex items-center justify-center text-primary">
            <User size={24} />
          </div>
        </div>

        <nav className="flex flex-col items-center gap-6 flex-1">
          <Button
            variant={currentScreen === "dashboard" ? "secondary" : "ghost"}
            size="icon"
            className={`w-12 h-12 rounded-full ${currentScreen === "dashboard" ? "bg-blue-100 text-blue-700" : "text-white hover:bg-blue-700/50"}`}
            onClick={() => navigateTo("dashboard")}
          >
            <Home size={24} />
            <span className="sr-only">Dashboard</span>
          </Button>

          <Button
            variant={currentScreen === "new-order" ? "secondary" : "ghost"}
            size="icon"
            className={`w-12 h-12 rounded-full ${currentScreen === "new-order" ? "bg-blue-100 text-blue-700" : "text-white hover:bg-blue-700/50"}`}
            onClick={() => navigateTo("new-order")}
          >
            <ShoppingBag size={24} />
            <span className="sr-only">New Order</span>
          </Button>

          <Button
            variant={currentScreen === "order-history" ? "secondary" : "ghost"}
            size="icon"
            className={`w-12 h-12 rounded-full ${currentScreen === "order-history" ? "bg-blue-100 text-blue-700" : "text-white hover:bg-blue-700/50"}`}
            onClick={() => navigateTo("order-history")}
          >
            <History size={24} />
            <span className="sr-only">Order History</span>
          </Button>

          <Button
            variant={currentScreen === "inventory" ? "secondary" : "ghost"}
            size="icon"
            className={`w-12 h-12 rounded-full ${currentScreen === "inventory" ? "bg-blue-100 text-blue-700" : "text-white hover:bg-blue-700/50"}`}
            onClick={() => navigateTo("inventory")}
          >
            <Package2 size={24} />
            <span className="sr-only">Inventory</span>
          </Button>

          <Button
            variant={currentScreen === "reports" ? "secondary" : "ghost"}
            size="icon"
            className={`w-12 h-12 rounded-full ${currentScreen === "reports" ? "bg-blue-100 text-blue-700" : "text-white hover:bg-blue-700/50"}`}
            onClick={() => navigateTo("reports")}
          >
            <BarChart3 size={24} />
            <span className="sr-only">Reports</span>
          </Button>

          <Button
            variant={currentScreen === "settings" ? "secondary" : "ghost"}
            size="icon"
            className={`w-12 h-12 rounded-full ${currentScreen === "settings" ? "bg-blue-100 text-blue-700" : "text-white hover:bg-blue-700/50"}`}
            onClick={() => navigateTo("settings")}
          >
            <Settings size={24} />
            <span className="sr-only">Settings</span>
          </Button>
        </nav>

        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full mt-auto text-white hover:bg-blue-700/50">
          <LogOut size={24} />
          <span className="sr-only">Logout</span>
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">
              {currentScreen === "dashboard" && "Dashboard"}
              {currentScreen === "new-order" && "New Order"}
              {currentScreen === "checkout" && "Checkout"}
              {currentScreen === "success" && "Order Complete"}
              {currentScreen === "order-history" && "Order History"}
              {currentScreen === "inventory" && "Inventory Management"}
              {currentScreen === "reports" && "Reports & Analytics"}
              {currentScreen === "settings" && "Settings"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span>{currentTime.toLocaleDateString()}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="font-medium">John Doe</span>
              <span className="text-muted-foreground text-sm">Cashier</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto">
          {currentScreen === "dashboard" && <Dashboard onNewOrder={startNewOrder} />}
          {currentScreen === "new-order" && <NewOrder onCheckout={handleOrder} />}
          {currentScreen === "checkout" && (
            <Checkout order={currentOrder} onComplete={completeOrder} onBack={() => navigateTo("new-order")} />
          )}
          {currentScreen === "success" && <OrderSuccess order={currentOrder} onNewOrder={startNewOrder} />}
          {currentScreen === "order-history" && <OrderHistory />}
          {currentScreen === "inventory" && <Inventory />}
          {currentScreen === "reports" && <Reports />}
          {currentScreen === "settings" && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

