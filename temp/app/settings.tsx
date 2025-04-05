"use client"

import { useState } from "react"
import { Save, User, Building, CreditCard, Bell, Shield, Users, Plus, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-blue-900">Settings</h1>
        <p className="text-muted-foreground">Manage your restaurant settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Building className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="payment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restaurant Information</CardTitle>
              <CardDescription>Update your restaurant details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="flex-shrink-0">
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt="Restaurant Logo" />
                      <AvatarFallback>RL</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Logo
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-name">Restaurant Name</Label>
                      <Input id="restaurant-name" defaultValue="Acme Restaurant" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-phone">Phone Number</Label>
                      <Input id="restaurant-phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="restaurant-address">Address</Label>
                    <Textarea id="restaurant-address" defaultValue="123 Main Street, Anytown, CA 12345" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-email">Email</Label>
                      <Input id="restaurant-email" defaultValue="info@acmerestaurant.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-website">Website</Label>
                      <Input id="restaurant-website" defaultValue="www.acmerestaurant.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="restaurant-tax">Tax Rate (%)</Label>
                      <Input id="restaurant-tax" defaultValue="8.0" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
              <CardDescription>Set your restaurant operating hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <div className="w-24 font-medium">{day}</div>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="09:00">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                              {`${i.toString().padStart(2, "0")}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span>to</span>
                      <Select defaultValue="22:00">
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                              {`${i.toString().padStart(2, "0")}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center space-x-2 ml-4">
                        <Switch id={`closed-${day}`} />
                        <Label htmlFor={`closed-${day}`}>Closed</Label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Hours
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Manage staff accounts and permissions</CardDescription>
                </div>
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Manager", status: "Active" },
                  { name: "Jane Smith", email: "jane@example.com", role: "Cashier", status: "Active" },
                  { name: "Robert Johnson", email: "robert@example.com", role: "Waiter", status: "Active" },
                  { name: "Emily Davis", email: "emily@example.com", role: "Chef", status: "Active" },
                  { name: "Michael Wilson", email: "michael@example.com", role: "Cashier", status: "Inactive" },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">{user.role}</div>
                      <div className={`text-sm ${user.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                        {user.status}
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>Configure access levels for different roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { role: "Manager", description: "Full access to all features" },
                  { role: "Cashier", description: "Access to orders and payments" },
                  { role: "Waiter", description: "Access to orders only" },
                  { role: "Chef", description: "Access to kitchen display system" },
                ].map((role, index) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <h3 className="font-medium text-lg">{role.role}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        "Create Orders",
                        "Edit Orders",
                        "Cancel Orders",
                        "Process Payments",
                        "View Reports",
                        "Manage Inventory",
                        "Manage Users",
                        "Access Settings",
                      ].map((permission, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Switch
                            id={`${role.role}-${permission}`}
                            defaultChecked={
                              role.role === "Manager" ||
                              (role.role === "Cashier" &&
                                ["Create Orders", "Edit Orders", "Process Payments"].includes(permission)) ||
                              (role.role === "Waiter" && ["Create Orders"].includes(permission)) ||
                              (role.role === "Chef" && [].includes(permission))
                            }
                          />
                          <Label htmlFor={`${role.role}-${permission}`}>{permission}</Label>
                        </div>
                      ))}
                    </div>

                    {index < 3 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Permissions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Configure accepted payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { method: "Cash", enabled: true },
                  { method: "Credit/Debit Card", enabled: true },
                  { method: "Mobile Wallet", enabled: true },
                  { method: "QR Code Payment", enabled: false },
                  { method: "Gift Cards", enabled: false },
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium">{payment.method}</div>
                    <div className="flex items-center space-x-2">
                      <Switch id={`payment-${index}`} defaultChecked={payment.enabled} />
                      <Label htmlFor={`payment-${index}`}>{payment.enabled ? "Enabled" : "Disabled"}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Processors</CardTitle>
              <CardDescription>Configure payment gateway settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-processor">Default Payment Processor</Label>
                <Select defaultValue="stripe">
                  <SelectTrigger id="payment-processor">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stripe">Stripe</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="custom">Custom Gateway</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="password" defaultValue="sk_test_••••••••••••••••••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input id="webhook-url" defaultValue="https://acmerestaurant.com/api/webhooks/payments" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="test-mode" defaultChecked />
                <Label htmlFor="test-mode">Test Mode</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receipt Settings</CardTitle>
              <CardDescription>Configure receipt printing and emailing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receipt-header">Receipt Header</Label>
                <Textarea
                  id="receipt-header"
                  defaultValue="Acme Restaurant\n123 Main Street\nAnytown, CA 12345\nPhone: (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="receipt-footer">Receipt Footer</Label>
                <Textarea
                  id="receipt-footer"
                  defaultValue="Thank you for dining with us!\nVisit us online at www.acmerestaurant.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="auto-print" defaultChecked />
                  <Label htmlFor="auto-print">Auto-print receipts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="email-receipt" defaultChecked />
                  <Label htmlFor="email-receipt">Email receipts to customers</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Receipt Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {[
                  { type: "New Orders", email: true, push: true, sms: false },
                  { type: "Order Cancellations", email: true, push: true, sms: true },
                  { type: "Low Inventory Alerts", email: true, push: false, sms: false },
                  { type: "Daily Sales Reports", email: true, push: false, sms: false },
                  { type: "Staff Login Alerts", email: false, push: true, sms: false },
                ].map((notification, index) => (
                  <div key={index} className="grid grid-cols-4 items-center p-4 border rounded-lg">
                    <div className="font-medium">{notification.type}</div>
                    <div className="flex items-center space-x-2">
                      <Switch id={`email-${index}`} defaultChecked={notification.email} />
                      <Label htmlFor={`email-${index}`}>Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id={`push-${index}`} defaultChecked={notification.push} />
                      <Label htmlFor={`push-${index}`}>Push</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id={`sms-${index}`} defaultChecked={notification.sms} />
                      <Label htmlFor={`sms-${index}`}>SMS</Label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-from">From Email Address</Label>
                <Input id="email-from" defaultValue="notifications@acmerestaurant.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-recipients">Additional Recipients</Label>
                <Input id="email-recipients" defaultValue="manager@acmerestaurant.com, owner@acmerestaurant.com" />
              </div>

              <div className="space-y-2">
                <Label>Email Template</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default Template</SelectItem>
                    <SelectItem value="minimal">Minimal Template</SelectItem>
                    <SelectItem value="branded">Branded Template</SelectItem>
                    <SelectItem value="custom">Custom Template</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="include-logo" defaultChecked />
                <Label htmlFor="include-logo">Include Restaurant Logo</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="america-los_angeles">
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-los_angeles">America/Los Angeles (UTC-8)</SelectItem>
                      <SelectItem value="america-new_york">America/New York (UTC-5)</SelectItem>
                      <SelectItem value="europe-london">Europe/London (UTC+0)</SelectItem>
                      <SelectItem value="europe-paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem value="asia-tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="cad">CAD (C$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY/MM/DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="font-medium">System Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-logout" defaultChecked />
                    <Label htmlFor="auto-logout">Auto Logout (after 30 min inactivity)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="kitchen-display" defaultChecked />
                    <Label htmlFor="kitchen-display">Kitchen Display System</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="customer-display" defaultChecked />
                    <Label htmlFor="customer-display">Customer Facing Display</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hardware Settings</CardTitle>
              <CardDescription>Configure connected hardware devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Receipt Printer</div>
                    <div className="text-sm text-muted-foreground">Epson TM-T88VI</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Cash Drawer</div>
                    <div className="text-sm text-muted-foreground">APG VB320-BL1616</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Barcode Scanner</div>
                    <div className="text-sm text-muted-foreground">Symbol LS2208</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500">Disconnected</Badge>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">Card Reader</div>
                    <div className="text-sm text-muted-foreground">Square Terminal</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Connected</Badge>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add New Device
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
              <CardDescription>Manage system backups and restoration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Automatic Backups</div>
                  <div className="text-sm text-muted-foreground">System data is backed up daily at 2:00 AM</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="auto-backup" defaultChecked />
                  <Label htmlFor="auto-backup">Enabled</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-location">Backup Location</Label>
                <Select defaultValue="cloud">
                  <SelectTrigger id="backup-location">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cloud">Cloud Storage</SelectItem>
                    <SelectItem value="local">Local Storage</SelectItem>
                    <SelectItem value="both">Both Cloud and Local</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Create Backup Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

