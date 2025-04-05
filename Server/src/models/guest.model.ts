import mongoose, { Document, Schema, Types } from 'mongoose'

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: Address
  idType: 'passport' | 'driver_license' | 'national_id'
  idNumber: string
  nationality?: string
  reservationNumber?: string
}

export interface IGuestDocument extends Document {
  hotelId: Types.ObjectId
  personalInfo: PersonalInfo
  preferences: string[]
  isCorporateGuest?: boolean
  companyName?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const addressSchema = new Schema<Address>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
)

const personalInfoSchema = new Schema<PersonalInfo>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (v: string) => /^[+]?[\d\s\-()]+$/.test(v),
        message: (props: any) => `${props.value} is not a valid phone number!`
      }
    },
    address: { type: addressSchema, required: true },
    idType: {
      type: String,
      required: true,
      enum: ['passport', 'driver_license', 'national_id']
    },
    idNumber: { type: String, required: true, trim: true },
    nationality: { type: String, trim: true },
    reservationNumber: { type: String, trim: true }
  },
  { _id: false }
)

const guestSchema = new Schema<IGuestDocument>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel'
    },
    personalInfo: {
      type: personalInfoSchema,
      required: true
    },
    preferences: [{ type: String, trim: true }],
    isCorporateGuest: { type: Boolean, default: false },
    companyName: { type: String, trim: true },
    notes: { type: String, trim: true }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

// Indexes for common queries
guestSchema.index({ hotelId: 1, 'personalInfo.email': 1 })
guestSchema.index({ 'personalInfo.phone': 1 })
guestSchema.index({ 'personalInfo.idNumber': 1 })

guestSchema.virtual('fullName').get(function (this: IGuestDocument) {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`
})

const Guest = mongoose.model<IGuestDocument>('Guest', guestSchema)
export default Guest
