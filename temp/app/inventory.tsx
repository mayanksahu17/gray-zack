"use client"

import { useState } from "react"
import { Search, Filter, Plus, Edit, Trash2, AlertCircle, ArrowUpDown, Upload, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"

// Sample inventory data
const inventoryItems = [
  {
    id: "INV-001",
    name: "Flour",
    category: "Dry Goods",
    unit: "kg",
    quantity: 25,
    minQuantity: 10,
    price: 1.99,
    supplier: "Global Foods Inc.",
    lastRestocked: "2023-06-10",
    status: "in-stock",
  },
  {
    id: "INV-002",
    name: "Sugar",
    category: "Dry Goods",
    unit: "kg",
    quantity: 15,
    minQuantity: 5,
    price: 2.49,
    supplier: "Global Foods Inc.",
    lastRestocked: "2023-06-08",
    status: "in-stock",
  },
  {
    id: "INV-003",
    name: "Tomato Sauce",
    category: "Sauces",
    unit: "bottle",
    quantity: 30,
    minQuantity: 10,
    price: 3.99,
    supplier: "Fresh Farms Ltd.",
    lastRestocked: "2023-06-12",
    status: "in-stock",
  },
  {
    id: "INV-004",
    name: "Mozzarella Cheese",
    category: "Dairy",
    unit: "kg",
    quantity: 8,
    minQuantity: 5,
    price: 7.99,
    supplier: "Dairy Delights",
    lastRestocked: "2023-06-14",
    status: "in-stock",
  },
  {
    id: "INV-005",
    name: "Chicken Breast",
    category: "Meat",
    unit: "kg",
    quantity: 12,
    minQuantity: 8,
    price: 9.99,
    supplier: "Premium Meats",
    lastRestocked: "2023-06-15",
    status: "in-stock",
  },
  {
    id: "INV-006",
    name: "Olive Oil",
    category: "Oils",
    unit: "bottle",
    quantity: 6,
    minQuantity: 3,
    price: 8.49,
    supplier: "Mediterranean Imports",
    lastRestocked: "2023-06-05",
    status: "in-stock",
  },
  {
    id: "INV-007",
    name: "Lettuce",
    category: "Vegetables",
    unit: "head",
    quantity: 10,
    minQuantity: 5,
    price: 1.49,
    supplier: "Fresh Farms Ltd.",
    lastRestocked: "2023-06-15",
    status: "in-stock",
  },
  {
    id: "INV-008",
    name: "Onions",
    category: "Vegetables",
    unit: "kg",
    quantity: 15,
    minQuantity: 8,
    price: 1.29,
    supplier: "Fresh Farms Ltd.",
    lastRestocked: "2023-06-10",
    status: "in-stock",
  },
  {
    id: "INV-009",
    name: "Soft Drink Cans",
    category: "Beverages",
    unit: "pack",
    quantity: 4,
    minQuantity: 5,
    price: 12.99,
    supplier: "Beverage Distributors",
    lastRestocked: "2023-06-01",
    status: "low-stock",
  },
  {
    id: "INV-010",
    name: "Coffee Beans",
    category: "Beverages",
    unit: "kg",
    quantity: 2,
    minQuantity: 3,
    price: 15.99,
    supplier: "Beverage Distributors",
    lastRestocked: "2023-06-02",
    status: "low-stock",
  },
  {
    id: "INV-011",
    name: "Napkins",
    category: "Disposables",
    unit: "pack",
    quantity: 0,
    minQuantity: 5,
    price: 3.49,
    supplier: "Restaurant Supplies Co.",
    lastRestocked: "2023-05-20",
    status: "out-of-stock",
  },
  {
    id: "INV-012",
    name: "To-Go Containers",
    category: "Disposables",
    unit: "pack",
    quantity: 1,
    minQuantity: 3,
    price: 9.99,
    supplier: "Restaurant Supplies Co.",
    lastRestocked: "2023-05-25",
    status: "low-stock",
  },
]

// Sample categories
const categories = [
  "All Categories",
  "Dry Goods",
  "Sauces",
  "Dairy",
  "Meat",
  "Oils",
  "Vegetables",
  "Beverages",
  "Disposables",
]

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All Categories")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    unit: "",
    quantity: 0,
    minQuantity: 0,
    price: 0,
    supplier: "",
  })

  // Filter inventory items based on search term and filters
  const filteredItems = inventoryItems.filter((item) => {
    // Search filter
    const searchMatch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())

    // Category filter
    const categoryMatch = categoryFilter === "All Categories" || item.category === categoryFilter

    // Status filter
    const statusMatch = statusFilter === "all" || item.status === statusFilter

    return searchMatch && categoryMatch && statusMatch
  })

  // Handle adding a new item
  const handleAddItem = () => {
    // In a real app, this would add the item to the database
    setIsAddItemDialogOpen(false)
    // Reset form
    setNewItem({
      name: "",
      category: "",
      unit: "",
      quantity: 0,
      minQuantity: 0,
      price: 0,
      supplier: "",
    })
  }

  // Handle editing an item
  const handleEditItem = (item) => {
    setSelectedItem(item)
    setIsEditItemDialogOpen(true)
  }

  // Handle updating an item
  const handleUpdateItem = () => {
    // In a real app, this would update the item in the database
    setIsEditItemDialogOpen(false)
    setSelectedItem(null)
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "in-stock":
        return <Badge className="bg-green-500">In Stock</Badge>
      case "low-stock":
        return <Badge className="bg-amber-500">Low Stock</Badge>
      case "out-of-stock":
        return <Badge className="bg-red-500">Out of Stock</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Get stock level indicator
  const getStockLevelIndicator = (item) => {
    const percentage = (item.quantity / item.minQuantity) * 100

    if (item.quantity === 0) {
      return <Progress value={0} className="h-2 w-24 bg-gray-200" indicatorClassName="bg-red-500" />
    } else if (item.quantity < item.minQuantity) {
      return (
        <Progress value={percentage} max={200} className="h-2 w-24 bg-gray-200" indicatorClassName="bg-amber-500" />
      )
    } else {
      return (
        <Progress
          value={percentage > 200 ? 100 : percentage / 2}
          className="h-2 w-24 bg-gray-200"
          indicatorClassName="bg-green-500"
        />
      )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{inventoryItems.length}</div>
            <p className="text-xs text-blue-600">Across {categories.length - 1} categories</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">In Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {inventoryItems.filter((item) => item.status === "in-stock").length}
            </div>
            <p className="text-xs text-green-600">Items available</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {inventoryItems.filter((item) => item.status === "low-stock").length}
            </div>
            <p className="text-xs text-amber-600">Items need reordering</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {inventoryItems.filter((item) => item.status === "out-of-stock").length}
            </div>
            <p className="text-xs text-red-600">Items unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory items..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setIsAddItemDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage your restaurant inventory</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Quantity
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 h-auto font-medium">
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    No inventory items found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">
                      {item.quantity} {item.unit}
                      {item.quantity < item.minQuantity && (
                        <AlertCircle className="h-4 w-4 text-amber-500 inline ml-1" />
                      )}
                    </TableCell>
                    <TableCell>{getStockLevelIndicator(item)}</TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.lastRestocked}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>Add a new item to your inventory. Fill in all the required fields.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name</Label>
                <Input
                  id="item-name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Flour"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-category">Category</Label>
                <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                  <SelectTrigger id="item-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-quantity">Quantity</Label>
                <Input
                  id="item-quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-unit">Unit</Label>
                <Select value={newItem.unit} onValueChange={(value) => setNewItem({ ...newItem, unit: value })}>
                  <SelectTrigger id="item-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                    <SelectItem value="l">Liter (l)</SelectItem>
                    <SelectItem value="ml">Milliliter (ml)</SelectItem>
                    <SelectItem value="unit">Unit</SelectItem>
                    <SelectItem value="pack">Pack</SelectItem>
                    <SelectItem value="bottle">Bottle</SelectItem>
                    <SelectItem value="box">Box</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-min-quantity">Minimum Quantity</Label>
                <Input
                  id="item-min-quantity"
                  type="number"
                  value={newItem.minQuantity}
                  onChange={(e) => setNewItem({ ...newItem, minQuantity: Number(e.target.value) })}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="item-price">Price</Label>
                <Input
                  id="item-price"
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-supplier">Supplier</Label>
              <Input
                id="item-supplier"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                placeholder="e.g., Global Foods Inc."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      {selectedItem && (
        <Dialog open={isEditItemDialogOpen} onOpenChange={setIsEditItemDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
              <DialogDescription>Update the details for {selectedItem.name}.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-name">Item Name</Label>
                  <Input id="edit-item-name" defaultValue={selectedItem.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-item-category">Category</Label>
                  <Select defaultValue={selectedItem.category}>
                    <SelectTrigger id="edit-item-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-quantity">Quantity</Label>
                  <Input id="edit-item-quantity" type="number" defaultValue={selectedItem.quantity} min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-item-unit">Unit</Label>
                  <Select defaultValue={selectedItem.unit}>
                    <SelectTrigger id="edit-item-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilogram (kg)</SelectItem>
                      <SelectItem value="g">Gram (g)</SelectItem>
                      <SelectItem value="l">Liter (l)</SelectItem>
                      <SelectItem value="ml">Milliliter (ml)</SelectItem>
                      <SelectItem value="unit">Unit</SelectItem>
                      <SelectItem value="pack">Pack</SelectItem>
                      <SelectItem value="bottle">Bottle</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-item-min-quantity">Minimum Quantity</Label>
                  <Input id="edit-item-min-quantity" type="number" defaultValue={selectedItem.minQuantity} min="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-item-price">Price</Label>
                  <Input id="edit-item-price" type="number" defaultValue={selectedItem.price} min="0" step="0.01" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-item-supplier">Supplier</Label>
                <Input id="edit-item-supplier" defaultValue={selectedItem.supplier} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditItemDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateItem}>Update Item</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

