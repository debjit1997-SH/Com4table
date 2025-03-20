import { NextResponse } from "next/server"
import { getCustomers, createCustomer } from "@/lib/db"

export async function GET() {
  try {
    const customers = await getCustomers()
    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Format the customer data
    const customer = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      type: body.type || "regular",
      totalSpent: 0,
      lastPurchase: null,
      createdAt: new Date(),
    }

    const result = await createCustomer(customer)
    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}

