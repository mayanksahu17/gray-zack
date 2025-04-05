import mongoose, { Document, Schema, Types } from 'mongoose';

// Define enum types for better type safety
enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  CASH = 'cash',
  BANK_TRANSFER = 'bank_transfer'
}

enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

enum BillStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PARTIALLY_PAID = 'partially_paid',
  CANCELLED = 'cancelled'
}

enum ServiceType {
  RESTAURANT = 'restaurant',
  ROOM_SERVICE = 'room_service',
  SPA = 'spa',
  LAUNDRY = 'laundry',
  MINIBAR = 'minibar',
  OTHER = 'other'
}

// Interfaces for nested objects
interface StayDetails {
  checkIn: Date;
  checkOut: Date;
  nights: number;
  roomCharges: number;
}

interface OrderCharge {
  orderId: Types.ObjectId;
  serviceType: ServiceType;
  serviceName: string;
  amount: number;
  date: Date;
}

interface Extra {
  description: string;
  amount: number;
}

interface Payment {
  method: PaymentMethod;
  cardType?: string;
  lastFourDigits?: string;
  transactionId?: string;
  status: PaymentStatus;
  date: Date;
}

// Main interface for the Bill document
export interface IBill extends Document {
  hotelId: Types.ObjectId;
  guestId: Types.ObjectId;
  roomId: Types.ObjectId;
  roomNumber: string;
  stayDetails: StayDetails;
  orderCharges: OrderCharge[];
  extras: Extra[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  payment: Payment;
  status: BillStatus;
  notes?: string;
  employeeId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  calculateTotals(): void;
  isPaid(): boolean;
  getDuration(): number;
}

// Schema definitions for nested objects
const StayDetailsSchema = new Schema<StayDetails>({
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required'],
    validate: {
      validator: function(this: any, checkOut: Date) {
        return checkOut > this.checkIn;
      },
      message: 'Check-out date must be after check-in date'
    }
  },
  nights: {
    type: Number,
    required: [true, 'Number of nights is required'],
    min: [1, 'Minimum stay is 1 night'],
    validate: {
      validator: function(this: any, nights: number) {
        if (!this.checkIn || !this.checkOut) return true;
        
        const checkInDate = new Date(this.checkIn);
        const checkOutDate = new Date(this.checkOut);
        const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return nights === diffDays;
      },
      message: 'Number of nights does not match the difference between check-in and check-out dates'
    }
  },
  roomCharges: {
    type: Number,
    required: [true, 'Room charges are required'],
    min: [0, 'Room charges cannot be negative']
  }
}, { _id: false });

const OrderChargeSchema = new Schema<OrderCharge>({
  orderId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Order ID is required'],
    ref: 'Order'
  },
  serviceType: {
    type: String,
    enum: {
      values: Object.values(ServiceType),
      message: '{VALUE} is not a valid service type'
    },
    required: [true, 'Service type is required']
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    minlength: [2, 'Service name must be at least 2 characters long'],
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    validate: {
      validator: function(this: any, date: Date) {
        const parentPath = this.parent();
        if (!parentPath || !parentPath.parent) return true;
        
        const parent = parentPath.parent();
        if (!parent.stayDetails) return true;
        
        return date >= parent.stayDetails.checkIn && date <= parent.stayDetails.checkOut;
      },
      message: 'Order date must be within the stay period'
    }
  }
}, { _id: true });

const ExtraSchema = new Schema<Extra>({
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [2, 'Description must be at least 2 characters long'],
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  }
}, { _id: true });

const PaymentSchema = new Schema<Payment>({
  method: {
    type: String,
    enum: {
      values: Object.values(PaymentMethod),
      message: '{VALUE} is not a valid payment method'
    },
    required: [true, 'Payment method is required']
  },
  cardType: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: any) {
        const isCreditOrDebitCard = 
          this.method === PaymentMethod.CREDIT_CARD || 
          this.method === PaymentMethod.DEBIT_CARD;
        
        return !isCreditOrDebitCard || (isCreditOrDebitCard && this.cardType);
      },
      message: 'Card type is required for credit/debit card payments'
    }
  },
  lastFourDigits: {
    type: String,
    trim: true,
    validate: [
      {
        validator: function(this: any, digits: string) {
          if (this.method !== PaymentMethod.CREDIT_CARD && this.method !== PaymentMethod.DEBIT_CARD) {
            return true;
          }
          return digits !== undefined;
        },
        message: 'Last four digits are required for card payments'
      },
      {
        validator: function(this: any, digits: string) {
          if (this.method !== PaymentMethod.CREDIT_CARD && this.method !== PaymentMethod.DEBIT_CARD) {
            return true;
          }
          return /^\d{4}$/.test(digits);
        },
        message: 'Last four digits must be exactly 4 numeric characters'
      }
    ]
  },
  transactionId: {
    type: String,
    trim: true,
    validate: {
      validator: function(this: any) {
        return this.method === PaymentMethod.CASH || this.transactionId;
      },
      message: 'Transaction ID is required for non-cash payments'
    }
  },
  status: {
    type: String,
    enum: {
      values: Object.values(PaymentStatus),
      message: '{VALUE} is not a valid payment status'
    },
    required: [true, 'Payment status is required']
  },
  date: {
    type: Date,
    required: [true, 'Payment date is required']
  }
}, { _id: false });

// Main Bill Schema
const BillSchema = new Schema<IBill>({
  hotelId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Hotel ID is required'],
    ref: 'Hotel'
  },
  guestId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Guest ID is required'],
    ref: 'Guest'
  },
  roomId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Room ID is required'],
    ref: 'Room'
  },
  roomNumber: {
    type: String,
    required: [true, 'Room number is required'],
    trim: true
  },
  stayDetails: {
    type: StayDetailsSchema,
    required: [true, 'Stay details are required']
  },
  orderCharges: {
    type: [OrderChargeSchema],
    default: []
  },
  extras: {
    type: [ExtraSchema],
    default: []
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: [0, 'Subtotal cannot be negative'],
    validate: {
      validator: function(this: any, subtotal: number) {
        const calculatedSubtotal = this.stayDetails.roomCharges + 
          this.orderCharges.reduce((sum: number, order: OrderCharge) => sum + order.amount, 0) + 
          this.extras.reduce((sum: number, extra: Extra) => sum + extra.amount, 0);
        
        // Allow for minor floating point differences (e.g., 1364.34 vs 1364.339999999)
        return Math.abs(calculatedSubtotal - subtotal) < 0.01;
      },
      message: 'Subtotal does not match the sum of room charges, order charges, and extras'
    }
  },
  tax: {
    type: Number,
    required: [true, 'Tax is required'],
    min: [0, 'Tax cannot be negative']
  },
  grandTotal: {
    type: Number,
    required: [true, 'Grand total is required'],
    min: [0, 'Grand total cannot be negative'],
    validate: {
      validator: function(this: any, grandTotal: number) {
        const calculatedGrandTotal = this.subtotal + this.tax;
        
        // Allow for minor floating point differences
        return Math.abs(calculatedGrandTotal - grandTotal) < 0.01;
      },
      message: 'Grand total does not match the sum of subtotal and tax'
    }
  },
  payment: {
    type: PaymentSchema,
    required: [true, 'Payment details are required']
  },
  status: {
    type: String,
    enum: {
      values: Object.values(BillStatus),
      message: '{VALUE} is not a valid bill status'
    },
    required: [true, 'Bill status is required'],
    validate: {
      validator: function(this: any, status: string) {
        if (status === BillStatus.PAID && this.payment.status !== PaymentStatus.COMPLETED) {
          return false;
        }
        if (status === BillStatus.CANCELLED && this.payment.status === PaymentStatus.COMPLETED) {
          return false;
        }
        return true;
      },
      message: 'Bill status is inconsistent with payment status'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  employeeId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Employee ID is required'],
    ref: 'Employee'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance
BillSchema.index({ hotelId: 1, createdAt: -1 });
BillSchema.index({ guestId: 1 });
BillSchema.index({ 'payment.status': 1 });
BillSchema.index({ status: 1 });
BillSchema.index({ 'stayDetails.checkIn': 1, 'stayDetails.checkOut': 1 });

// Instance methods
BillSchema.methods.calculateTotals = function(): void {
  // Calculate subtotal
  const roomCharges = this.stayDetails.roomCharges || 0;
  const orderTotal = this.orderCharges.reduce((sum: number, order: OrderCharge) => sum + order.amount, 0);
  const extrasTotal = this.extras.reduce((sum: number, extra: Extra) => sum + extra.amount, 0);
  
  this.subtotal = Number((roomCharges + orderTotal + extrasTotal).toFixed(2));
  
  // Calculate tax (assuming tax is 10% of subtotal for this example)
  this.tax = Number((this.subtotal * 0.1).toFixed(2));
  
  // Calculate grand total
  this.grandTotal = Number((this.subtotal + this.tax).toFixed(2));
};

BillSchema.methods.isPaid = function(): boolean {
  return this.status === BillStatus.PAID;
};

BillSchema.methods.getDuration = function(): number {
  return this.stayDetails.nights;
};

// Pre-save hook to ensure calculations are correct
BillSchema.pre('save', function(next) {
  // Recalculate totals before saving
  this.calculateTotals();
  
  // Update status based on payment status
  if (this.payment.status === PaymentStatus.COMPLETED) {
    this.status = BillStatus.PAID;
  } else if (this.payment.status === PaymentStatus.PENDING) {
    this.status = BillStatus.PENDING;
  }
  
  next();
});

// Virtual properties
BillSchema.virtual('durationDays').get(function(this: IBill) {
  return this.stayDetails.nights;
});

BillSchema.virtual('averageDailyRate').get(function(this: IBill) {
  if (!this.stayDetails.nights || this.stayDetails.nights === 0) return 0;
  return Number((this.stayDetails.roomCharges / this.stayDetails.nights).toFixed(2));
});

// Create and export the model
const Bill = mongoose.model<IBill>('Bill', BillSchema);

export { 
  Bill, 
  BillStatus, 
  PaymentMethod, 
  PaymentStatus,
  ServiceType
};