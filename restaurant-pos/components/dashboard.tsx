"use client"

import { ShoppingBag, DollarSign, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard({ onNewOrder } : any) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Total Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">$1,248.50</div>
            <p className="text-xs text-blue-600">+18% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Orders Today</CardTitle>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">42</div>
            <p className="text-xs text-blue-600">+8% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Active Tables</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">8/12</div>
            <p className="text-xs text-blue-600">4 tables available</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Avg. Order Time</CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">24 min</div>
            <p className="text-xs text-blue-600">-2 min from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((order) => (
                <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Order #{1000 + order}</div>
                    <div className="text-sm text-muted-foreground">
                      Table {Math.floor(Math.random() * 10) + 1} • {Math.floor(Math.random() * 3) + 2} items
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${(Math.random() * 100).toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{Math.floor(Math.random() * 30) + 1} min ago</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
            <CardDescription>Most ordered today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Margherita Pizza</div>
                <div>12 orders</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Chicken Burger</div>
                <div>10 orders</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Caesar Salad</div>
                <div>8 orders</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Chocolate Cake</div>
                <div>7 orders</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Iced Coffee</div>
                <div>6 orders</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          size="lg"
          className="w-full max-w-md text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          onClick={onNewOrder}
        >
          <ShoppingBag className="mr-2 h-5 w-5" /> New Order
        </Button>
      </div>
    </div>
  )
}

