"use client"

import { ShoppingBag, DollarSign, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface DashboardStats {
  totalSales: number;
  ordersToday: number;
  activeTables: number;
  totalTables: number;
  avgOrderTime: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  tableNumber?: string;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  total: number;
  createdAt: string;
}

interface PopularItem {
  name: string;
  orderCount: number;
}

export default function Dashboard({ onNewOrder }: { onNewOrder: () => void }) {
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const restaurantId = "67e8f522404a64803d0cea8d"; // This would typically come from a route parameter

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch restaurant tables
        const tablesResponse = await fetch(`http://localhost:8000/api/v1/admin/hotel/restaurant/${restaurantId}/tables`);
        const tablesData = await tablesResponse.json();
        
        if (!tablesData.success) {
          throw new Error("Failed to fetch tables");
        }

        const activeTables = tablesData.data.filter((table: any) => table.status === "occupied").length;
        const totalTables = tablesData.data.length;

        // Fetch recent orders
        const ordersResponse = await fetch(`http://localhost:8000/api/v1/admin/hotel/restaurant/${restaurantId}/orders`);
        const ordersData = await ordersResponse.json();
        
        if (!ordersData.success) {
          throw new Error("Failed to fetch orders");
        }

        const today = new Date();
        const ordersToday = ordersData.data.filter((order: any) => {
          const orderDate = new Date(order.orderDate);
          return orderDate.toDateString() === today.toDateString();
        });

        // Calculate total sales
        const totalSales = ordersToday.reduce((sum: number, order: any) => sum + order.total, 0);

        // Calculate average order time (placeholder - would need actual data)
        const avgOrderTime = 24; // This would be calculated from actual order data

        // Get recent orders
        const sortedOrders = [...ordersData.data].sort((a: any, b: any) => 
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        ).slice(0, 5);

        // Calculate popular items
        const itemCounts: { [key: string]: number } = {};
        ordersToday.forEach((order: any) => {
          order.items.forEach((item: any) => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
          });
        });

        const popularItems = Object.entries(itemCounts)
          .map(([name, count]) => ({ name, orderCount: count }))
          .sort((a, b) => b.orderCount - a.orderCount)
          .slice(0, 5);

        setStats({
          totalSales,
          ordersToday: ordersToday.length,
          activeTables,
          totalTables,
          avgOrderTime
        });

        setRecentOrders(sortedOrders);
        setPopularItems(popularItems);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-blue-100 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Total Sales</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{formatCurrency(stats?.totalSales || 0)}</div>
            <p className="text-xs text-blue-600">Today's total sales</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Orders Today</CardTitle>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.ordersToday || 0}</div>
            <p className="text-xs text-blue-600">Total orders today</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Active Tables</CardTitle>
            <Users className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.activeTables}/{stats?.totalTables}</div>
            <p className="text-xs text-blue-600">{stats ? stats.totalTables - stats.activeTables : 0} tables available</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
            <CardTitle className="text-sm font-medium text-blue-800">Avg. Order Time</CardTitle>
            <Clock className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.avgOrderTime || 0} min</div>
            <p className="text-xs text-blue-600">Average preparation time</p>
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
              {recentOrders.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No recent orders</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Order #{order.orderNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.tableNumber ? `Table ${order.tableNumber}` : 'Takeout'} • {order.items.length} items
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(order.total)}</div>
                      <div className="text-sm text-muted-foreground">{formatTimeAgo(order.createdAt)}</div>
                    </div>
                  </div>
                ))
              )}
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
              {popularItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">No popular items today</div>
              ) : (
                popularItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="font-medium">{item.name}</div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {item.orderCount} orders
                    </Badge>
                  </div>
                ))
              )}
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

