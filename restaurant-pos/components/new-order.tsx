"use client"
import { useState , useEffect } from "react"
import { Plus, Minus, Edit, Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { log } from "node:console"

  // Function to fetch restaurant data and return the menu
// Async function to fetch restaurant data and return menu
const getRestaurentData = async () => {
  try {
    const response = await fetch('https://8tvnlx2t-8000.inc1.devtunnels.ms/api/v1/admin/hotel/restaurant/67e8f522404a64803d0cea8d/menu')
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data);
    
    if (data.success && data.data?.menu) {
      return data.data.menu
    } else {
      throw new Error('Menu data not found in the response.')
    } 
  } catch (error) {
    console.error("Failed to fetch restaurant data:", error)
    return []
  }
}
async function addMenuToRestaurant(restaurantId: string, menuData: any) {
  const url = `https://8tvnlx2t-8000.inc1.devtunnels.ms/api/v1/admin/hotel/restaurant/${restaurantId}/menu`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Menu added successfully:", result);
    return result;
  } catch (error) {
    console.error("Error adding menu:", error);
  }
}


export default function NewOrder({ onCheckout }: any) {
  const [menuCategories, setMenuCategories] = useState<any[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [cart, setCart] = useState([])
  const [customizeItem, setCustomizeItem] = useState(null)
  const [customizations, setCustomizations] = useState({
    size: "medium",
    addons: [],
    cookingPreference: "",
    specialInstructions: "",
    quantity: 1,
  })
  const [showAddMenuDialog, setShowAddMenuDialog] = useState(false)
  const [newMenu, setNewMenu] = useState({
    name: '',
    description: '',
    items: [
      {
        name: '',
        description: '',
        price: 0,
        isVegetarian: false,
        spicyLevel: 0,
      },
    ],
  })
  const [newMenuItem, setNewMenuItem] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    isVegetarian: false,
    spicyLevel: 0,
  })
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [promoCode, setPromoCode] = useState("")
  const [showEditMenuDialog, setShowEditMenuDialog] = useState(false)
  const [editingMenuItem, setEditingMenuItem] = useState<any>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string>("")

    // Load menu data on component mount
    useEffect(() => {
      const fetchMenu = async () => {
        const menu = await getRestaurentData()
        setMenuCategories(menu)
        if (menu.length > 0) {
          setActiveCategory(menu[0].id)
        }
      }
      fetchMenu()
    }, [])

  // Calculate cart totals
  const subtotal = cart.reduce((sum : any, item : any) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const discount = promoCode ? subtotal * 0.1 : 0 // 10% discount if promo code applied
  const total = subtotal + tax - discount

  // Handle adding item to cart
  const addToCart = (item : any) => {
    setCustomizeItem(item)
    setCustomizations({
      size: "medium",
      addons: [],
      cookingPreference: "",  
      specialInstructions: "",
      quantity: 1,
    })
    setEditingItemIndex(null)
  }

  // Handle editing cart item
  const editCartItem = (index : any) => {
    const item : any = cart[index]
    setCustomizeItem({
      ...item,
      addons: undefined,
      cookingPreference: undefined,
      specialInstructions: undefined,
      quantity: undefined,
    })
    setCustomizations({
      size: item.size || "medium",
      addons: item.addons || [],
      cookingPreference: item.cookingPreference || "",
      specialInstructions: item.specialInstructions || "",
      quantity: item.quantity || 1,
    })
    setEditingItemIndex(index)
  }

  // Handle removing item from cart
  const removeFromCart = (index : any) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  // Handle updating item quantity in cart
  const updateCartItemQuantity = (index  :any, newQuantity : any) => {
    if (newQuantity < 1) return

    const updatedCart : any = [...cart]
    updatedCart[index].quantity = newQuantity
    setCart(updatedCart)
  }

  // Handle confirming item customization
  const confirmCustomization = () => {
    const customizedItem  = {
      ...customizeItem,
      size: customizations.size,
      addons: customizations.addons,
      cookingPreference: customizations.cookingPreference,
      specialInstructions: customizations.specialInstructions,
      quantity: customizations.quantity,
    }

    if (editingItemIndex !== null) {
      // Update existing item
      const updatedCart : any = [...cart]
      updatedCart[editingItemIndex] = customizedItem
      setCart(updatedCart)
    } else {
      // Add new item
      setCart([...cart, customizedItem])
    }

    setCustomizeItem(null)
    setEditingItemIndex(null)
  }

  // Handle applying promo code
  const applyPromoCode = () => {
    // In a real app, this would validate the promo code
    setShowPromoDialog(false)
  }

  // Calculate addon price
  const calculateAddonPrice = (addons : any) => {
    const addonPrices = {
      "Extra Cheese": 1.99,
      Bacon: 2.49,
      Avocado: 1.99,
      Mushrooms: 1.49,
    }

    return addons.reduce((sum : any, addon : any) => sum + (addonPrices[addon] || 0), 0)
  }

  // Calculate total item price including addons
  const calculateItemTotal = (item : any) => {
    const basePrice = item.price
    const sizeMultiplier = item.size === "small" ? 0.8 : item.size === "large" ? 1.2 : 1
    const addonPrice = item.addons ? calculateAddonPrice(item.addons) : 0

    return (basePrice * sizeMultiplier + addonPrice) * item.quantity
  }

  const handleEditMenuItem = async (categoryId: string, item: any) => {
    setEditingMenuItem(item)
    setEditingCategoryId(categoryId)
    setShowEditMenuDialog(true)
  }

  const handleDeleteMenuItem = async () => {
    if (!editingMenuItem || !editingCategoryId) return

    try {
      const response = await fetch(
        `https://8tvnlx2t-8000.inc1.devtunnels.ms/api/v1/admin/hotel/restaurant/67e8f522404a64803d0cea8d/menu-items/${editingCategoryId}/${editingMenuItem.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete menu item')
      }

      const result = await response.json()
      if (result.success) {
        setShowEditMenuDialog(false)
        const updatedMenu = await getRestaurentData()
        setMenuCategories(updatedMenu)
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }

  const handleUpdateMenuItem = async () => {
    if (!editingMenuItem || !editingCategoryId) return

    try {
      console.log({
        ...editingMenuItem,
        categoryId: editingCategoryId
      });
      
      const response = await fetch(
        `https://8tvnlx2t-8000.inc1.devtunnels.ms/api/v1/admin/hotel/restaurant/67e8f522404a64803d0cea8d/menu-items/${editingMenuItem.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...editingMenuItem,
            categoryId: editingCategoryId
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update menu item')
      }

      const result = await response.json()
      if (result.success) {
        setShowEditMenuDialog(false)
        const updatedMenu = await getRestaurentData()
        setMenuCategories(updatedMenu)
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
    }
  }

  return (
    <div className="flex h-full">
      {/* Left Panel - Menu Categories and Items */}
      <div className="w-3/5 border-r">
      
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
          <TabsList className="flex justify-start px-4 pt-4 pb-0 h-auto bg-transparent border-b rounded-none">
            {menuCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 rounded-t-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-blue-200 data-[state=active]:border-b-0 border-muted"
              >
                {category.name}
              </TabsTrigger>
            ))}
            <Button
            className="ml-4 mb-2 bg-green-600 text-white px-4 py-2 rounded-t-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-transparent data-[state=active]:border data-[state=active]:border-blue-200 data-[state=active]:border-b-0 border-muted"
            onClick={() => setShowAddMenuDialog(true)}
          >
            Add New Menu
          </Button>
          </TabsList>

          {menuCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="flex-1 p-4 m-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {category.items.map((item : any) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow border-blue-100">
                      <CardContent className="p-0">
                        <div className="aspect-video bg-blue-50 flex items-center justify-center">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-blue-900">{item.name}</h3>
                              <p className="text-sm text-blue-600">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => handleEditMenuItem(category.id, item)}
                              >
                                <Edit className="h-5 w-5" />
                                <span className="sr-only">Edit {item.name}</span>
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-5 w-5" />
                                <span className="sr-only">Add {item.name}</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}


          
        </Tabs>

        
      </div>
      

      {/* Right Panel - Cart */}
      <div className="w-2/5 flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Current Order</h2>
        </div>

        <ScrollArea className="flex-1 p-4">
          {cart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item : any, index : any) => (
                 <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        {item.size && <p>Size: {item.size.charAt(0).toUpperCase() + item.size.slice(1)}</p>}
                        {item.addons && item.addons.length > 0 && <p>Add-ons: {item.addons.join(", ")}</p>}
                        {item.cookingPreference && <p>Cooking: {item.cookingPreference}</p>}
                        {item.specialInstructions && <p>Note: {item.specialInstructions}</p>}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" onClick={() => editCartItem(index)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeFromCart(index)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease</span>
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-none"
                        onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                    <div className="font-medium">${calculateItemTotal(item).toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-4 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowPromoDialog(true)}>
              <Tag className="mr-2 h-4 w-4" />
              {promoCode ? "Promo Applied" : "Apply Promo"}
            </Button>
            <Button variant="outline" className="flex-1">
              Hold Order
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="destructive" className="flex-1" onClick={() => setCart([])} disabled={cart.length === 0}>
              Clear
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onCheckout({ items: cart, subtotal, tax, discount, total })}
              disabled={cart.length === 0}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Item Customization Modal */}
      {customizeItem && (
        <Dialog open={true} onOpenChange={() => setCustomizeItem(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Customize {customizeItem.name}</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Size</Label>
                <RadioGroup
                  value={customizations.size}
                  onValueChange={(value) => setCustomizations({ ...customizations, size: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="size-small" />
                    <Label htmlFor="size-small">Small</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="size-medium" />
                    <Label htmlFor="size-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="size-large" />
                    <Label htmlFor="size-large">Large</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Add-ons</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addon-cheese"
                      checked={customizations.addons.includes("Extra Cheese")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCustomizations({
                            ...customizations,
                            addons: [...customizations.addons, "Extra Cheese"],
                          })
                        } else {
                          setCustomizations({
                            ...customizations,
                            addons: customizations.addons.filter((addon) => addon !== "Extra Cheese"),
                          })
                        }
                      }}
                    />
                    <Label htmlFor="addon-cheese">Extra Cheese (+$1.99)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addon-bacon"
                      checked={customizations.addons.includes("Bacon")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCustomizations({
                            ...customizations,
                            addons: [...customizations.addons, "Bacon"],
                          })
                        } else {
                          setCustomizations({
                            ...customizations,
                            addons: customizations.addons.filter((addon) => addon !== "Bacon"),
                          })
                        }
                      }}
                    />
                    <Label htmlFor="addon-bacon">Bacon (+$2.49)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addon-avocado"
                      checked={customizations.addons.includes("Avocado")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCustomizations({
                            ...customizations,
                            addons: [...customizations.addons, "Avocado"],
                          })
                        } else {
                          setCustomizations({
                            ...customizations,
                            addons: customizations.addons.filter((addon) => addon !== "Avocado"),
                          })
                        }
                      }}
                    />
                    <Label htmlFor="addon-avocado">Avocado (+$1.99)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="addon-mushrooms"
                      checked={customizations.addons.includes("Mushrooms")}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setCustomizations({
                            ...customizations,
                            addons: [...customizations.addons, "Mushrooms"],
                          })
                        } else {
                          setCustomizations({
                            ...customizations,
                            addons: customizations.addons.filter((addon) => addon !== "Mushrooms"),
                          })
                        }
                      }}
                    />
                    <Label htmlFor="addon-mushrooms">Mushrooms (+$1.49)</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cooking Preference</Label>
                <RadioGroup
                  value={customizations.cookingPreference}
                  onValueChange={(value) => setCustomizations({ ...customizations, cookingPreference: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Rare" id="cooking-rare" />
                    <Label htmlFor="cooking-rare">Rare</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Medium" id="cooking-medium" />
                    <Label htmlFor="cooking-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Well-done" id="cooking-well" />
                    <Label htmlFor="cooking-well">Well-done</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="special-instructions">Special Instructions</Label>
                <Input
                  id="special-instructions"
                  value={customizations.specialInstructions}
                  onChange={(e) => setCustomizations({ ...customizations, specialInstructions: e.target.value })}
                  placeholder="E.g., No onions, extra spicy, etc."
                />
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center border rounded-md w-32">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => {
                      if (customizations.quantity > 1) {
                        setCustomizations({ ...customizations, quantity: customizations.quantity - 1 })
                      }
                    }}
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Decrease</span>
                  </Button>
                  <span className="flex-1 text-center">{customizations.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-none"
                    onClick={() => setCustomizations({ ...customizations, quantity: customizations.quantity + 1 })}
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Increase</span>
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCustomizeItem(null)}>
                Cancel
              </Button>
              <Button onClick={confirmCustomization}>Add to Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Promo Code Dialog */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Apply Promo Code</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="promo-code">Enter Promo Code</Label>
              <Input
                id="promo-code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="WELCOME10"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPromoDialog(false)}>
              Cancel
            </Button>
            <Button onClick={applyPromoCode} disabled={!promoCode}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={showAddMenuDialog} onOpenChange={setShowAddMenuDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Menu Item</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="existing-category" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing-category">Add to Existing Category</TabsTrigger>
              <TabsTrigger value="new-category">Create New Category</TabsTrigger>
            </TabsList>

            <TabsContent value="existing-category" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="Item Name"
                  value={newMenuItem.name}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                />  
              </div>

              <div className="space-y-2">
                <Label>Item Description</Label>
                <Input
                  placeholder="Item Description"
                  value={newMenuItem.description}
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  placeholder="Price"
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, price: parseFloat(e.target.value) })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newMenuItem.isVegetarian}
                  onCheckedChange={(val) => setNewMenuItem({ ...newMenuItem, isVegetarian: val as boolean })}
                />
                <Label>Vegetarian</Label>
              </div>

              <div className="space-y-2">
                <Label>Spicy Level (0-5)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  placeholder="Spicy Level"
                  onChange={(e) => setNewMenuItem({ ...newMenuItem, spicyLevel: parseInt(e.target.value) })}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddMenuDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedCategory) {
                      alert("Please select a category");
                      return;
                    }
                    setNewMenuItem({ ...newMenuItem, id:uuidv4()})
                    const restaurantId = "67e8f522404a64803d0cea8d";
                    const result = await addMenuToRestaurant(restaurantId, {
                      id:  selectedCategory,
                      items: [newMenuItem]
                    });
                    if (result?.success) {
                      setShowAddMenuDialog(false);
                      const updatedMenu = await getRestaurentData();
                      setMenuCategories(updatedMenu);
                      setNewMenuItem({
                        name: '',
                        description: '',
                        price: 0,
                        isVegetarian: false,
                        spicyLevel: 0,
                      });
                    }
                  }}
                >
                  Add Item
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="new-category" className="space-y-4">
              {/* <div className="space-y-2">
                <Label>Category ID</Label>
                <Input
                  placeholder="Category ID"
                  value={newMenu.id}
                  onChange={(e) => setNewMenu({ ...newMenu, id: e.target.value })}
                />
              </div> */}

              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input
                  placeholder="Category Name"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Category Description</Label>
                <Input
                  placeholder="Category Description"
                  value={newMenu.description}
                  onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                />
              </div>

              <Separator />
              <h3 className="font-medium">Add Menu Item</h3>

              {/* <div className="space-y-2">
                <Label>Item ID</Label>
                <Input
                  placeholder="Item ID"
                  value={newMenu.items[0].id}
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      items: [{ ...newMenu.items[0], id: e.target.value }],
                    })
                  }
                />
              </div> */}

              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input
                  placeholder="Item Name"
                  value={newMenu.items[0].name}
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      items: [{ ...newMenu.items[0], name: e.target.value }],
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Item Description</Label>
                <Input
                  placeholder="Item Description"
                  value={newMenu.items[0].description}
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      items: [{ ...newMenu.items[0], description: e.target.value }],
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  placeholder="Price"
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      items: [{ ...newMenu.items[0], price: parseFloat(e.target.value) }],
                    })
                  }
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={newMenu.items[0].isVegetarian}
                  onCheckedChange={(val) =>
                    setNewMenu({
                      ...newMenu,
                      items: [{ ...newMenu.items[0], isVegetarian: val as boolean }],
                    })
                  }
                />
                <Label>Vegetarian</Label>
              </div>

              <div className="space-y-2">
                <Label>Spicy Level (0-5)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  placeholder="Spicy Level"
                  onChange={(e) =>
                    setNewMenu({
                      ...newMenu,
                      items: [{ ...newMenu.items[0], spicyLevel: parseInt(e.target.value) }],
                    })
                  }
                />
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddMenuDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    const restaurantId = "67e8f522404a64803d0cea8d";
                    const result = await addMenuToRestaurant(restaurantId, newMenu);
                    if (result?.success) {
                      setShowAddMenuDialog(false);
                      const updatedMenu = await getRestaurentData();
                      setMenuCategories(updatedMenu);
                      setNewMenu({
                        name: '',
                        description: '',
                        items: [
                          {
                            name: '',
                            description: '',
                            price: 0,
                            isVegetarian: false,
                            spicyLevel: 0,
                          },
                        ],
                      });
                    }
                  }}
                >
                  Add Category
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Edit Menu Item Dialog */}
      <Dialog open={showEditMenuDialog} onOpenChange={setShowEditMenuDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Item Name</Label>
              <Input
                value={editingMenuItem?.name || ''}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                placeholder="Item Name"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={editingMenuItem?.description || ''}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                placeholder="Item Description"
              />
            </div>

            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                type="number"
                value={editingMenuItem?.price || 0}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: parseFloat(e.target.value) })}
                placeholder="Price"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={editingMenuItem?.isVegetarian || false}
                onCheckedChange={(val) => setEditingMenuItem({ ...editingMenuItem, isVegetarian: val as boolean })}
              />
              <Label>Vegetarian</Label>
            </div>

            <div className="space-y-2">
              <Label>Spicy Level (0-5)</Label>
              <Input
                type="number"
                min="0"
                max="5"
                value={editingMenuItem?.spicyLevel || 0}
                onChange={(e) => setEditingMenuItem({ ...editingMenuItem, spicyLevel: parseInt(e.target.value) })}
                placeholder="Spicy Level"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={handleDeleteMenuItem}>
              Delete Item
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditMenuDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateMenuItem}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}

