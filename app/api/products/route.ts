import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET() {
  try {
    await dbConnect()
    const products = await Product.find({})
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect()
    const body = await request.json()

    // Format the product data
    const product = {
      name: body.name,
      price: Number.parseFloat(body.price),
      tax: Number.parseInt(body.tax),
      category: body.category,
      sku: body.sku || `PRD${Date.now()}`,
      stock: Number.parseInt(body.stock) || 0,
      createdAt: new Date(),
    }

    const newProduct = await Product.create(product)
    return NextResponse.json({ success: true, id: newProduct._id })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}

