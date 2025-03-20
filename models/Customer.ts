import mongoose from "mongoose"

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  type: { type: String, enum: ["regular", "vip"], default: "regular" },
  totalSpent: { type: Number, default: 0 },
  lastPurchase: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema)

