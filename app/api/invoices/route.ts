import { NextResponse } from "next/server"
import { getInvoices, createInvoice } from "@/lib/db"

export async function GET() {
  try {
    const invoices = await getInvoices()
    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Format the invoice data
    const invoice = {
      invoiceNumber: body.invoiceNumber,
      date: new Date(),
      customer: body.customer,
      items: body.items,
      paymentMethod: body.paymentMethod,
      subtotal: body.subtotal,
      tax: body.tax,
      total: body.total,
      status: body.status || "completed",
      createdAt: new Date(),
    }

    const result = await createInvoice(invoice)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
  }
}

