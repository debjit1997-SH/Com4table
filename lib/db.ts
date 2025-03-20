import clientPromise from "./mongodb"

// Helper function to get database and collection
export async function getCollection(collectionName: string) {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB || "Com4table")
  return db.collection(collectionName)
}

// Products
export async function getProducts() {
  const collection = await getCollection("products")
  return collection.find({}).toArray()
}

export async function getProductById(id: string) {
  const collection = await getCollection("products")
  return collection.findOne({ _id: id })
}

export async function createProduct(product: any) {
  const collection = await getCollection("products")
  return collection.insertOne(product)
}

export async function updateProduct(id: string, product: any) {
  const collection = await getCollection("products")
  return collection.updateOne({ _id: id }, { $set: product })
}

export async function deleteProduct(id: string) {
  const collection = await getCollection("products")
  return collection.deleteOne({ _id: id })
}

// Customers
export async function getCustomers() {
  const collection = await getCollection("customers")
  return collection.find({}).toArray()
}

export async function getCustomerById(id: string) {
  const collection = await getCollection("customers")
  return collection.findOne({ _id: id })
}

export async function createCustomer(customer: any) {
  const collection = await getCollection("customers")
  return collection.insertOne(customer)
}

export async function updateCustomer(id: string, customer: any) {
  const collection = await getCollection("customers")
  return collection.updateOne({ _id: id }, { $set: customer })
}

export async function deleteCustomer(id: string) {
  const collection = await getCollection("customers")
  return collection.deleteOne({ _id: id })
}

// Invoices
export async function getInvoices() {
  const collection = await getCollection("invoices")
  return collection.find({}).toArray()
}

export async function getInvoiceById(id: string) {
  const collection = await getCollection("invoices")
  return collection.findOne({ _id: id })
}

export async function createInvoice(invoice: any) {
  const collection = await getCollection("invoices")
  return collection.insertOne(invoice)
}

export async function updateInvoice(id: string, invoice: any) {
  const collection = await getCollection("invoices")
  return collection.updateOne({ _id: id }, { $set: invoice })
}

export async function deleteInvoice(id: string) {
  const collection = await getCollection("invoices")
  return collection.deleteOne({ _id: id })
}

// Users
export async function getUsers() {
  const collection = await getCollection("users")
  return collection.find({}).toArray()
}

export async function getUserById(id: string) {
  const collection = await getCollection("users")
  return collection.findOne({ _id: id })
}

export async function getUserByEmail(email: string) {
  const collection = await getCollection("users")
  return collection.findOne({ email })
}

export async function createUser(user: any) {
  const collection = await getCollection("users")
  return collection.insertOne(user)
}

export async function updateUser(id: string, user: any) {
  const collection = await getCollection("users")
  return collection.updateOne({ _id: id }, { $set: user })
}

export async function deleteUser(id: string) {
  const collection = await getCollection("users")
  return collection.deleteOne({ _id: id })
}

