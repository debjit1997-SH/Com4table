import mongoose from "mongoose"

const InvoiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  tax: { type: Number, required: true },
})

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  customer: { type: mongoose.Schema.Types.Mixed, required: true },
  items: [InvoiceItemSchema],
  paymentMethod: { type: String, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled", "paid"], default: "completed" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

export default mongoose.models.Invoice || mongoose.model("Invoice", InvoiceSchema)

