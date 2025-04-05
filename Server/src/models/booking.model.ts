import mongoose, { Document, Schema, Types } from 'mongoose'

export enum BookingStatus {
  BOOKED = 'booked',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled'
}

interface AddOn {
  name: string
  description?: string
  cost: number
}

interface PaymentInfo {
  method: 'credit_card' | 'cash' | 'corporate' | 'online'
  status: 'pending' | 'authorized' | 'paid' | 'refunded'
  securityDeposit: number
  totalAmount: number
  paidAmount: number
  last4Digits?: string
  transactionId?: string
}

export interface IBookingDocument extends Document {
  hotelId: Types.ObjectId
  guestId: Types.ObjectId
  roomId: Types.ObjectId
  checkIn: Date
  expectedCheckOut: Date
  actualCheckOut?: Date
  adults: number
  children: number
  cardKey?: string
  addOns: AddOn[]
  payment: PaymentInfo
  status: BookingStatus
  createdAt: Date
  updatedAt: Date
}

const addOnSchema = new Schema<AddOn>(
  {
    name: { type: String, required: true },
    description: { type: String },
    cost: { type: Number, required: true, min: 0 }
  },
  { _id: false }
)

const paymentInfoSchema = new Schema<PaymentInfo>(
  {
    method: {
      type: String,
      required: true,
      enum: ['credit_card', 'cash', 'corporate' , 'online']
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'authorized', 'paid', 'refunded'],
      default: 'pending'
    },
    securityDeposit: { type: Number, required: true, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paidAmount: { type: Number, required: true, min: 0 },
    last4Digits: { type: String, trim: true },
    transactionId: { type: String, trim: true }
  },
  { _id: false }
)

const bookingSchema = new Schema<IBookingDocument>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel'
    },
    guestId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Guest'
    },
    roomId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Room'
    },
    checkIn: { type: Date, required: true },
    expectedCheckOut: { type: Date, required: true },
    actualCheckOut: { type: Date },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, required: true, min: 0 },
    cardKey: { type: String, trim: true },
    addOns: { type: [addOnSchema], default: [] },
    payment: { type: paymentInfoSchema, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      required: true,
      default: BookingStatus.BOOKED
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

bookingSchema.index({ guestId: 1, status: 1 })
bookingSchema.index({ roomId: 1, checkIn: 1, expectedCheckOut: 1 })

const Booking = mongoose.model<IBookingDocument>('Booking', bookingSchema)
export default Booking
