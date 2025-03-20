import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  role: { type: String, enum: ["admin", "manager", "cashier", "pending"], default: "pending" },
  authorized: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
})

export default mongoose.models.User || mongoose.model("User", UserSchema)

