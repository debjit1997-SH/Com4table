import { formatDate } from "@/lib/utils"

export function PrintInvoice({ invoiceData, storeInfo, companyName = "StoreBill Software" }) {
  const {
    invoiceNumber = "INV-1001",
    date = new Date(),
    customer = {},
    items = [],
    paymentMethod = "Cash",
    subtotal = 0,
    tax = 0,
    total = 0,
  } = invoiceData || {}

  const {
    name = "My Store",
    address = "123 Main Street, City, State, ZIP",
    phone = "123-456-7890",
    email = "store@example.com",
    gstin = "22AAAAA0000A1Z5",
  } = storeInfo || {}

  return (
    <div className="hidden print:block p-8 max-w-[210mm] mx-auto bg-white text-black">
      {/* Store Header */}
      <div className="text-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">{name}</h1>
        <p className="text-sm">{address}</p>
        <p className="text-sm">
          Phone: {phone} | Email: {email}
        </p>
        <p className="text-sm">GSTIN: {gstin}</p>
      </div>

      {/* Invoice Info */}
      <div className="flex justify-between mb-6">
        <div>
          <h2 className="font-bold">INVOICE</h2>
          <p className="text-sm">Invoice #: {invoiceNumber}</p>
          <p className="text-sm">Date: {formatDate(date)}</p>
          <p className="text-sm">Payment Method: {paymentMethod}</p>
        </div>
        <div>
          <h3 className="font-bold">Bill To:</h3>
          <p className="text-sm">{customer.name || "Walk-in Customer"}</p>
          {customer.phone && <p className="text-sm">Phone: {customer.phone}</p>}
          {customer.email && <p className="text-sm">Email: {customer.email}</p>}
          {customer.address && <p className="text-sm">{customer.address}</p>}
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-collapse">
        <thead>
          <tr className="border-b border-t">
            <th className="text-left py-2">Item</th>
            <th className="text-right py-2">Price</th>
            <th className="text-right py-2">Qty</th>
            <th className="text-right py-2">Tax</th>
            <th className="text-right py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="py-2">{item.name}</td>
              <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
              <td className="text-right py-2">{item.quantity}</td>
              <td className="text-right py-2">{item.tax}%</td>
              <td className="text-right py-2">₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-1">
            <span>Subtotal:</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Tax:</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold border-t border-b">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Terms and Signature */}
      <div className="mb-8">
        <h3 className="font-bold mb-2">Terms & Conditions:</h3>
        <ol className="text-sm list-decimal pl-5">
          <li>Goods once sold will not be taken back.</li>
          <li>All disputes are subject to local jurisdiction.</li>
        </ol>
      </div>

      <div className="flex justify-between mt-16">
        <div>
          <p className="border-t pt-1">Customer Signature</p>
        </div>
        <div>
          <p className="border-t pt-1">Authorized Signature</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm mt-8 pt-4 border-t">
        <p>Thank you for your business!</p>
        <p className="text-gray-500 mt-2">Powered by {companyName}</p>
      </div>
    </div>
  )
}

