"use client"
import { useState } from "react"
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
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample menu data
const menuCategories = [
  {
    id: "starters",
    name: "Starters",
    items: [
      { id: "1", name: "Garlic Bread", price: 4.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "2", name: "Mozzarella Sticks", price: 6.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "3", name: "Bruschetta", price: 5.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "4", name: "Chicken Wings", price: 8.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: "main",
    name: "Main Course",
    items: [
      { id: "5", name: "Margherita Pizza", price: 12.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "6", name: "Chicken Burger", price: 10.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "7", name: "Pasta Carbonara", price: 13.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "8", name: "Grilled Salmon", price: 16.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    items: [
      { id: "9", name: "Soft Drink", price: 2.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "10", name: "Iced Tea", price: 3.49, image: "/placeholder.svg?height=80&width=80" },
      { id: "11", name: "Coffee", price: 3.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "12", name: "Fresh Juice", price: 4.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    items: [
      { id: "13", name: "Chocolate Cake", price: 6.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "14", name: "Cheesecake", price: 7.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "15", name: "Ice Cream", price: 4.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "16", name: "Apple Pie", price: 5.99, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
  {
    id: "sides",
    name: "Sides",
    items: [
      { id: "17", name: "French Fries", price: 3.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "18", name: "Onion Rings", price: 4.49, image: "/placeholder.svg?height=80&width=80" },
      { id: "19", name: "Side Salad", price: 4.99, image: "/placeholder.svg?height=80&width=80" },
      { id: "20", name: "Coleslaw", price: 3.49, image: "/placeholder.svg?height=80&width=80" },
    ],
  },
]

export default function NewOrder({ onCheckout }) {
  const [cart, setCart] = useState([])
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id)
  const [customizeItem, setCustomizeItem] = useState(null)
  const [customizations, setCustomizations] = useState({
    size: "medium",
    addons: [],
    cookingPreference: "",
    specialInstructions: "",
    quantity: 1,
  })
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [promoCode, setPromoCode] = useState("")

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.08 // 8% tax
  const discount = promoCode ? subtotal * 0.1 : 0 // 10% discount if promo code applied
  const total = subtotal + tax - discount

  // Handle adding item to cart
  const addToCart = (item) => {
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
  const editCartItem = (index) => {
    const item = cart[index]
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
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  // Handle updating item quantity in cart
  const updateCartItemQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return

    const updatedCart = [...cart]
    updatedCart[index].quantity = newQuantity
    setCart(updatedCart)
  }

  // Handle confirming item customization
  const confirmCustomization = () => {
    const customizedItem = {
      ...customizeItem,
      size: customizations.size,
      addons: customizations.addons,
      cookingPreference: customizations.cookingPreference,
      specialInstructions: customizations.specialInstructions,
      quantity: customizations.quantity,
    }

    if (editingItemIndex !== null) {
      // Update existing item
      const updatedCart = [...cart]
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
  const calculateAddonPrice = (addons) => {
    const addonPrices = {
      "Extra Cheese": 1.99,
      Bacon: 2.49,
      Avocado: 1.99,
      Mushrooms: 1.49,
    }

    return addons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0)
  }

  // Calculate total item price including addons
  const calculateItemTotal = (item) => {
    const basePrice = item.price
    const sizeMultiplier = item.size === "small" ? 0.8 : item.size === "large" ? 1.2 : 1
    const addonPrice = item.addons ? calculateAddonPrice(item.addons) : 0

    return (basePrice * sizeMultiplier + addonPrice) * item.quantity
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
          </TabsList>

          {menuCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="flex-1 p-4 m-0">
              <ScrollArea className="h-[calc(100vh-12rem)]">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {category.items.map((item) => (
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
              {cart.map((item, index) => (
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
    </div>
  )
}

