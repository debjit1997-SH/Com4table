import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const id = params.id
    const product = await Product.findById(id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const id = params.id
    const body = await request.json()

    // Format the product data
    const product = {
      name: body.name,
      price: Number.parseFloat(body.price),
      tax: Number.parseInt(body.tax),
      category: body.category,
      sku: body.sku,
      stock: Number.parseInt(body.stock) || 0,
      updatedAt: new Date(),
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true })

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, product: updatedProduct })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const id = params.id
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

