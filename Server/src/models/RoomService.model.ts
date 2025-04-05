import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IRoomServiceDocument extends Document {
  bookingId: Types.ObjectId
  guestId: Types.ObjectId
  roomId: Types.ObjectId
  serviceType: 'food' | 'laundry' | 'cleaning' | 'spa' | 'maintenance' | 'custom' |'bar'
  description: string
  cost: number
  requestedAt: Date
  fulfilledAt?: Date
  fulfilledBy?: string // Staff name or ID
  isBilled: boolean
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const roomServiceSchema = new Schema<IRoomServiceDocument>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Booking'
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
    serviceType: {
      type: String,
      required: true,
      enum: ['food', 'laundry', 'cleaning', 'spa', 'maintenance', 'custom', 'bar']
    },
    description: { type: String, required: true, trim: true },
    cost: { type: Number, required: true, min: 0 },
    requestedAt: { type: Date, required: true, default: Date.now },
    fulfilledAt: { type: Date },
    fulfilledBy: { type: String, trim: true },
    isBilled: { type: Boolean, required: true, default: false },
    notes: { type: String, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

roomServiceSchema.index({ bookingId: 1, requestedAt: -1 })
roomServiceSchema.index({ guestId: 1 })
roomServiceSchema.index({ isBilled: 1 })

const RoomService = mongoose.model<IRoomServiceDocument>('RoomService', roomServiceSchema)
export default RoomService
