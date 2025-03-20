import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dbConnect from "../lib/mongoose"
import Product from "../models/Product"
import Customer from "../models/Customer"
import User from "../models/User"
import Invoice from "../models/Invoice"

async function seedDatabase() {
  try {
    await dbConnect()
    console.log("Connected to MongoDB")

    // Clear existing collections
    await Product.deleteMany({})
    await Customer.deleteMany({})
    await User.deleteMany({})
    await Invoice.deleteMany({})

    console.log("Existing data cleared")

    // Seed products
    const products = [
      { name: "Product 1", price: 100, tax: 18, category: "general", sku: "PRD001", stock: 50 },
      { name: "Product 2", price: 200, tax: 12, category: "electronics", sku: "PRD002", stock: 25 },
      { name: "Product 3", price: 150, tax: 5, category: "food", sku: "PRD003", stock: 100 },
      { name: "Product 4", price: 300, tax: 28, category: "luxury", sku: "PRD004", stock: 10 },
      { name: "Product 5", price: 50, tax: 0, category: "essentials", sku: "PRD005", stock: 200 },
    ]

    await Product.insertMany(products)
    console.log("Products seeded")

    // Seed customers
    const customers = [
      {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
        address: "123 Main St, City, State, 400001",
        type: "regular",
        totalSpent: 12500,
        lastPurchase: new Date("2023-03-15"),
      },
      {
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "8765432109",
        address: "456 Park Ave, Town, State, 400002",
        type: "regular",
        totalSpent: 8750,
        lastPurchase: new Date("2023-03-10"),
      },
      {
        name: "Raj Kumar",
        email: "raj.kumar@example.com",
        phone: "7654321098",
        address: "789 Oak St, Village, State, 400003",
        type: "vip",
        totalSpent: 25000,
        lastPurchase: new Date("2023-03-05"),
      },
    ]

    const savedCustomers = await Customer.insertMany(customers)
    console.log("Customers seeded")

    // Seed users
    const salt = await bcrypt.genSalt(10)
    const users = [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: await bcrypt.hash("password123", salt),
        role: "admin",
      },
      {
        name: "Store Manager",
        email: "manager@example.com",
        password: await bcrypt.hash("password123", salt),
        role: "manager",
      },
      {
        name: "Cashier One",
        email: "cashier1@example.com",
        password: await bcrypt.hash("password123", salt),
        role: "cashier",
      },
    ]

    await User.insertMany(users)
    console.log("Users seeded")

    // Seed some sample invoices
    const invoices = [
      {
        invoiceNumber: "INV-1001",
        date: new Date("2023-03-15"),
        customer: savedCustomers[0],
        items: [
          { name: "Product 1", price: 100, quantity: 2, tax: 18 },
          { name: "Product 2", price: 200, quantity: 1, tax: 12 },
        ],
        paymentMethod: "Cash",
        subtotal: 400,
        tax: 60,
        total: 460,
        status: "completed",
      },
      {
        invoiceNumber: "INV-1002",
        date: new Date("2023-03-14"),
        customer: savedCustomers[1],
        items: [
          { name: "Product 3", price: 150, quantity: 1, tax: 5 },
          { name: "Product 4", price: 300, quantity: 1, tax: 28 },
        ],
        paymentMethod: "Card",
        subtotal: 450,
        tax: 91.5,
        total: 541.5,
        status: "completed",
      },
    ]

    await Invoice.insertMany(invoices)
    console.log("Invoices seeded")

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await mongoose.disconnect()
    console.log("MongoDB connection closed")
  }
}

seedDatabase()

