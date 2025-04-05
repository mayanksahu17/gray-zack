import mongoose, { Document, Schema, Types } from 'mongoose'

interface LineItem {
  type: 'room_charge' | 'add_on' | 'room_service' | 'tax' | 'other'
  description: string
  amount: number
}

interface BillingInfo {
  method: 'credit_card' | 'cash' | 'corporate'
  paidAmount: number
  status: 'unpaid' | 'partial' | 'paid' | 'refunded'
  transactionId?: string
  paidAt?: Date
  refundAmount?: number
}

export interface IInvoiceDocument extends Document {
  bookingId: Types.ObjectId
  guestId: Types.ObjectId
  roomId: Types.ObjectId
  lineItems: LineItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  billing: BillingInfo
  issuedAt: Date
  createdAt: Date
  updatedAt: Date
}

const lineItemSchema = new Schema<LineItem>(
  {
    type: {
      type: String,
      required: true,
      enum: ['room_charge', 'add_on', 'room_service', 'tax', 'other']
    },
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 }
  },
  { _id: false }
)

const billingSchema = new Schema<BillingInfo>(
  {
    method: {
      type: String,
      required: true,
      enum: ['credit_card', 'cash', 'corporate']
    },
    paidAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ['unpaid', 'partial', 'paid', 'refunded'],
      default: 'unpaid'
    },
    transactionId: { type: String, trim: true },
    paidAt: { type: Date },
    refundAmount: { type: Number, min: 0 }
  },
  { _id: false }
)

const invoiceSchema = new Schema<IInvoiceDocument>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    guestId: {
      type: Schema.Types.ObjectId,
      ref: 'Guest',
      required: true
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    },
    lineItems: { type: [lineItemSchema], required: true },
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    billing: { type: billingSchema, required: true },
    issuedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

invoiceSchema.index({ bookingId: 1, issuedAt: -1 })

const Invoice = mongoose.model<IInvoiceDocument>('Invoice', invoiceSchema)
export default Invoice
