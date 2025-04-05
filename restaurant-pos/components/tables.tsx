"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Filter, MoreHorizontal, RefreshCw, Search, SlidersHorizontal } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define table interface
interface RestaurantTable {
  _id: string
  tableNumber: string
  capacity: number
  location: string
  status: "available" | "reserved" | "occupied" | "maintenance"
  features: string[]
}

export default function RestaurantTables() {
  const [tables, setTables] = useState<RestaurantTable[]>([])
  const [filteredTables, setFilteredTables] = useState<RestaurantTable[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)

  const restaurantId = "67e8f522404a64803d0cea8d" // This would typically come from a route parameter

  // Fetch tables data
  const fetchTables = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/v1/admin/hotel/restaurant/${restaurantId}/tables`)
      const data = await response.json()

      if (data.success) {
        setTables(data.data)
        setFilteredTables(data.data)
      } else {
        toast({
          title: "Error fetching tables",
          description: "Could not retrieve table data",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching tables:", error)
      toast({
        title: "Connection error",
        description: "Could not connect to the server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Update table status
  const updateTableStatus = async (tableId: string, newStatus: string) => {
    try {
      // In a real application, you would make an API call here
      // For demonstration, we'll update the local state
      const updatedTables = tables.map((table) =>
        table._id === tableId ? { ...table, status: newStatus as any } : table,
      )

      setTables(updatedTables)
      applyFilters(updatedTables)

      toast({
        title: "Status updated",
        description: `Table status has been updated to ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not update table status",
        variant: "destructive",
      })
    }
  }

  // Apply filters and search
  const applyFilters = (tableData = tables) => {
    let filtered = [...tableData]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((table) => table.status === statusFilter)
    }

    // Apply location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((table) => table.location === locationFilter)
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (table) =>
          table.tableNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          table.features.some((feature) => feature.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    setFilteredTables(filtered)
  }

  // Initialize data on component mount
  useEffect(() => {
    fetchTables()
  }, [])

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters()
  }, [statusFilter, locationFilter, searchQuery])

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "reserved":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "occupied":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "maintenance":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-800">Restaurant Tables Management</CardTitle>
              <CardDescription>Manage and update the status of all tables in your restaurant</CardDescription>
            </div>
            <Button variant="outline" className="border-blue-300 text-blue-700" onClick={fetchTables}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by table number or features..."
                className="pl-8 border-blue-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="border-blue-200">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-blue-600" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-40">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="border-blue-200">
                    <div className="flex items-center">
                      <SlidersHorizontal className="mr-2 h-4 w-4 text-blue-600" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Tables List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : (
            <div className="rounded-md border border-blue-100">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead className="text-blue-800">Table Number</TableHead>
                    <TableHead className="text-blue-800">Capacity</TableHead>
                    <TableHead className="text-blue-800">Location</TableHead>
                    <TableHead className="text-blue-800">Status</TableHead>
                    <TableHead className="text-blue-800">Features</TableHead>
                    <TableHead className="text-blue-800 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                        No tables found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTables.map((table) => (
                      <TableRow key={table._id}>
                        <TableCell className="font-medium">{table.tableNumber}</TableCell>
                        <TableCell>{table.capacity} people</TableCell>
                        <TableCell className="capitalize">{table.location}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(table.status)} font-normal`}>{table.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {table.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="bg-white border-blue-200 text-blue-700">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTable(table)
                                  setIsUpdateDialogOpen(true)
                                }}
                              >
                                Update Status
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Table Status</DialogTitle>
            <DialogDescription>Change the status of table {selectedTable?.tableNumber}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Select
                defaultValue={selectedTable?.status}
                onValueChange={(value) => {
                  if (selectedTable) {
                    updateTableStatus(selectedTable._id, value)
                    setIsUpdateDialogOpen(false)
                  }
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

