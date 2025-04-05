import mongoose, { Document, Schema, Types } from 'mongoose';

// Define interfaces for nested objects
interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ContactInfo {
  phone: string;
  email: string;
  website: string;
}

interface Owner {
  userId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
}

interface Subscription {
  plan: 'basic' | 'standard' | 'premium';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'trial';
}

// Define enums for subscription related fields
enum SubscriptionPlan {
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium'
}

enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TRIAL = 'trial'
}

enum HotelCategory {
  BUDGET = 'budget',
  BUSINESS = 'business',
  LUXURY = 'luxury',
  RESORT = 'resort'
}

// Hotel interface
export interface IHotelDocument extends Document {
  adminId: Types.ObjectId;
  name: string;
  description: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  category: HotelCategory;
  starRating: number;
  images: string[];
  amenities: string[];
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
  };
  subscriptionPlan: {
    planId: string;
    startDate: Date;
    endDate: Date;
    status: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isSubscriptionActive(): boolean;
  daysUntilExpiration(): number;
}

// Create schemas for nested objects
const addressSchema = new Schema<Address>(
  {
    street: { 
      type: String, 
      required: true, 
      trim: true 
    },
    city: { 
      type: String, 
      required: true, 
      trim: true 
    },
    state: { 
      type: String, 
      required: true, 
      trim: true 
    },
    zipCode: { 
      type: String, 
      required: true, 
      trim: true 
    },
    country: { 
      type: String, 
      required: true, 
      trim: true 
    }
  },
  { _id: false } // Prevent Mongoose from creating _id for subdocuments
);

const contactInfoSchema = new Schema<ContactInfo>(
  {
    phone: { 
      type: String, 
      required: true, 
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[+]?[\d\s-()]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    email: { 
      type: String, 
      required: true, 
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
    website: { 
      type: String, 
      required: true, 
      trim: true 
    }
  },
  { _id: false }
);

const ownerSchema = new Schema<Owner>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      required: true,
      ref: 'User' // Reference to User model, not creating a new model
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
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
        validator: function(v: string) {
          return /^[+]?[\d\s-()]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    }
  },
  { _id: false }
);

const subscriptionSchema = new Schema<Subscription>(
  {
    plan: { 
      type: String, 
      required: true,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.BASIC
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: { 
      type: Date, 
      required: true 
    },
    status: { 
      type: String, 
      required: true,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.TRIAL
    }
  },
  { _id: false }
);

// Main hotel schema
const hotelSchema = new Schema<IHotelDocument>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Administrator',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    category: {
      type: String,
      enum: Object.values(HotelCategory),
      required: true
    },
    starRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    images: [String],
    amenities: [String],
    contactInfo: {
      phone: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      website: String
    },
    policies: {
      checkIn: {
        type: String,
        required: true
      },
      checkOut: {
        type: String,
        required: true
      },
      cancellation: {
        type: String,
        required: true
      }
    },
    subscriptionPlan: {
      planId: String,
      startDate: Date,
      endDate: Date,
      status: {
        type: String,
        enum: ['active', 'expired', 'cancelled'],
        default: 'active'
      }
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Don't add __v field
  }
);

// Add indexes for efficient querying
hotelSchema.index({ location: '2dsphere' });
hotelSchema.index({ adminId: 1 });
hotelSchema.index({ category: 1 });
hotelSchema.index({ 'subscriptionPlan.status': 1 });

// Method to check if subscription is active
hotelSchema.methods.isSubscriptionActive = function(this: IHotelDocument): boolean {
  const now = new Date();
  return (
    this.subscriptionPlan.status === SubscriptionStatus.ACTIVE &&
    now >= this.subscriptionPlan.startDate &&
    now < this.subscriptionPlan.endDate
  );
};

// Method to calculate days until subscription expiration
hotelSchema.methods.daysUntilExpiration = function(this: IHotelDocument): number {
  const now = new Date();
  const endDate = new Date(this.subscriptionPlan.endDate);
  
  if (now > endDate) return 0;
  
  const differenceInTime = endDate.getTime() - now.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  
  return differenceInDays;
};

// Pre-save middleware to update subscription status based on dates
hotelSchema.pre('save', function(next) {
  const now = new Date();
  const sub = this.subscriptionPlan;
  
  // Update subscription status based on dates
  if (now < sub.startDate) {
    // Future subscription
    if (sub.status !== SubscriptionStatus.TRIAL) {
      sub.status = SubscriptionStatus.TRIAL;
    }
  } else if (now > sub.endDate) {
    // Expired subscription
    sub.status = SubscriptionStatus.EXPIRED;
  } else {
    // Active subscription
    if (sub.status !== SubscriptionStatus.ACTIVE) {
      sub.status = SubscriptionStatus.ACTIVE;
    }
  }
  
  next();
});

// Create and export the model
const Hotel = mongoose.model<IHotelDocument>('Hotel', hotelSchema);
export default Hotel;