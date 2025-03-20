"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { QrCode, Upload } from "lucide-react"

export default function SettingsPage() {
  const [storeSettings, setStoreSettings] = useState({
    name: "My Store",
    address: "123 Main St, City, State, ZIP",
    phone: "123-456-7890",
    email: "store@example.com",
    website: "www.mystore.com",
    gstin: "22AAAAA0000A1Z5",
    primaryColor: "#0f172a",
    logoUrl: "",
  })

  const [taxSettings, setTaxSettings] = useState({
    enableGST: true,
    enableTDS: false,
    enableTCS: false,
    defaultGSTRate: "18",
    defaultTDSRate: "2",
    defaultTCSRate: "1",
  })

  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: "INV",
    startNumber: "1001",
    termsAndConditions: "1. Goods once sold will not be taken back\n2. All disputes are subject to local jurisdiction",
    showLogo: true,
    showSignature: true,
  })

  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptUPI: true,
    acceptBankTransfer: true,
    qrCodeUrl: "",
  })

  const logoInputRef = useRef(null)
  const qrCodeInputRef = useRef(null)

  const handleStoreSettingsChange = (e) => {
    const { name, value } = e.target
    setStoreSettings({
      ...storeSettings,
      [name]: value,
    })
  }

  const handleTaxSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setTaxSettings({
      ...taxSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleInvoiceSettingsChange = (e) => {
    const { name, value, type, checked } = e.target
    setInvoiceSettings({
      ...invoiceSettings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSwitchChange = (name, checked) => {
    setTaxSettings({
      ...taxSettings,
      [name]: checked,
    })
  }

  const handleInvoiceSwitchChange = (name, checked) => {
    setInvoiceSettings({
      ...invoiceSettings,
      [name]: checked,
    })
  }

  const handlePaymentSwitchChange = (name, checked) => {
    setPaymentSettings({
      ...paymentSettings,
      [name]: checked,
    })
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setStoreSettings({
          ...storeSettings,
          logoUrl: event.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPaymentSettings({
          ...paymentSettings,
          qrCodeUrl: event.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">Store Settings</TabsTrigger>
          <TabsTrigger value="tax">Tax Settings</TabsTrigger>
          <TabsTrigger value="invoice">Invoice Settings</TabsTrigger>
          <TabsTrigger value="payment">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your store details that will appear on invoices and receipts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input id="store-name" name="name" value={storeSettings.name} onChange={handleStoreSettingsChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-gstin">GSTIN</Label>
                  <Input
                    id="store-gstin"
                    name="gstin"
                    value={storeSettings.gstin}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-address">Address</Label>
                <Input
                  id="store-address"
                  name="address"
                  value={storeSettings.address}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="store-phone">Phone</Label>
                  <Input
                    id="store-phone"
                    name="phone"
                    value={storeSettings.phone}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="store-email">Email</Label>
                  <Input
                    id="store-email"
                    name="email"
                    value={storeSettings.email}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-website">Website</Label>
                <Input
                  id="store-website"
                  name="website"
                  value={storeSettings.website}
                  onChange={handleStoreSettingsChange}
                />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex flex-col gap-4">
                  {storeSettings.logoUrl ? (
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="border p-4 rounded-lg">
                        <Image
                          src={storeSettings.logoUrl || "/placeholder.svg"}
                          alt="Store Logo"
                          width={100}
                          height={100}
                          className="object-contain"
                        />
                      </div>
                      <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
                        Change Logo
                      </Button>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                      <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-sm text-center text-muted-foreground mb-4">Upload your store logo</p>
                      <Button variant="outline" onClick={() => logoInputRef.current?.click()}>
                        Upload Logo
                      </Button>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color"
                    name="primaryColor"
                    type="color"
                    value={storeSettings.primaryColor}
                    onChange={handleStoreSettingsChange}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={storeSettings.primaryColor} onChange={handleStoreSettingsChange} name="primaryColor" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle>Tax Configuration</CardTitle>
              <CardDescription>Configure tax settings for your invoices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-gst">Enable GST</Label>
                  <p className="text-sm text-muted-foreground">Apply GST to your invoices</p>
                </div>
                <Switch
                  id="enable-gst"
                  checked={taxSettings.enableGST}
                  onCheckedChange={(checked) => handleSwitchChange("enableGST", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-tds">Enable TDS</Label>
                  <p className="text-sm text-muted-foreground">Apply TDS to your invoices</p>
                </div>
                <Switch
                  id="enable-tds"
                  checked={taxSettings.enableTDS}
                  onCheckedChange={(checked) => handleSwitchChange("enableTDS", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-tcs">Enable TCS</Label>
                  <p className="text-sm text-muted-foreground">Apply TCS to your invoices</p>
                </div>
                <Switch
                  id="enable-tcs"
                  checked={taxSettings.enableTCS}
                  onCheckedChange={(checked) => handleSwitchChange("enableTCS", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="default-gst-rate">Default GST Rate</Label>
                <RadioGroup
                  id="default-gst-rate"
                  value={taxSettings.defaultGSTRate}
                  onValueChange={(value) => setTaxSettings({ ...taxSettings, defaultGSTRate: value })}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="gst-0" />
                    <Label htmlFor="gst-0">0%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5" id="gst-5" />
                    <Label htmlFor="gst-5">5%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="12" id="gst-12" />
                    <Label htmlFor="gst-12">12%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="18" id="gst-18" />
                    <Label htmlFor="gst-18">18%</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="28" id="gst-28" />
                    <Label htmlFor="gst-28">28%</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Tax Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>Customize how your invoices look and behave</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
                  <Input
                    id="invoice-prefix"
                    name="prefix"
                    value={invoiceSettings.prefix}
                    onChange={handleInvoiceSettingsChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoice-start">Starting Number</Label>
                  <Input
                    id="invoice-start"
                    name="startNumber"
                    value={invoiceSettings.startNumber}
                    onChange={handleInvoiceSettingsChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <textarea
                  id="terms"
                  name="termsAndConditions"
                  value={invoiceSettings.termsAndConditions}
                  onChange={handleInvoiceSettingsChange}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-logo">Show Logo on Invoice</Label>
                  <p className="text-sm text-muted-foreground">Display your store logo on invoices</p>
                </div>
                <Switch
                  id="show-logo"
                  checked={invoiceSettings.showLogo}
                  onCheckedChange={(checked) => handleInvoiceSwitchChange("showLogo", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-signature">Show Signature Space</Label>
                  <p className="text-sm text-muted-foreground">Include a space for signature on invoices</p>
                </div>
                <Switch
                  id="show-signature"
                  checked={invoiceSettings.showSignature}
                  onCheckedChange={(checked) => handleInvoiceSwitchChange("showSignature", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Invoice Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accept-cash">Accept Cash</Label>
                  <p className="text-sm text-muted-foreground">Allow cash payments</p>
                </div>
                <Switch
                  id="accept-cash"
                  checked={paymentSettings.acceptCash}
                  onCheckedChange={(checked) => handlePaymentSwitchChange("acceptCash", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accept-card">Accept Card</Label>
                  <p className="text-sm text-muted-foreground">Allow card payments (manually processed)</p>
                </div>
                <Switch
                  id="accept-card"
                  checked={paymentSettings.acceptCard}
                  onCheckedChange={(checked) => handlePaymentSwitchChange("acceptCard", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accept-upi">Accept UPI</Label>
                  <p className="text-sm text-muted-foreground">Allow UPI payments</p>
                </div>
                <Switch
                  id="accept-upi"
                  checked={paymentSettings.acceptUPI}
                  onCheckedChange={(checked) => handlePaymentSwitchChange("acceptUPI", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="accept-bank">Accept Bank Transfer</Label>
                  <p className="text-sm text-muted-foreground">Allow bank transfer payments</p>
                </div>
                <Switch
                  id="accept-bank"
                  checked={paymentSettings.acceptBankTransfer}
                  onCheckedChange={(checked) => handlePaymentSwitchChange("acceptBankTransfer", checked)}
                />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label>Payment QR Code</Label>
                <div className="flex flex-col gap-4">
                  {paymentSettings.qrCodeUrl ? (
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="border p-4 rounded-lg">
                        <Image
                          src={paymentSettings.qrCodeUrl || "/placeholder.svg"}
                          alt="Payment QR Code"
                          width={150}
                          height={150}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                          This QR code will be displayed to customers when they choose QR payment.
                        </p>
                        <Button variant="outline" onClick={() => qrCodeInputRef.current?.click()}>
                          Change QR Code
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
                      <QrCode className="h-10 w-10 text-muted-foreground mb-4" />
                      <p className="text-sm text-center text-muted-foreground mb-4">
                        Upload your payment QR code (UPI, PayTM, etc.)
                      </p>
                      <Button variant="outline" onClick={() => qrCodeInputRef.current?.click()}>
                        Upload QR Code
                      </Button>
                    </div>
                  )}
                  <input
                    ref={qrCodeInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleQrCodeUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Payment Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

