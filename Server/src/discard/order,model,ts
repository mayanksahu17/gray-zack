import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderNumber: string;
  table?: mongoose.Types.ObjectId;
  roomNumber?: string;
  customer?: mongoose.Types.ObjectId;
  items: Array<{
    menuItem: mongoose.Types.ObjectId;
    quantity: number;
    options?: Array<{
      name: string;
      choice: string;
      priceAdjustment: number;
    }>;
    notes?: string;
    price: number;
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  tip?: number;
  total: number;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  paymentMethod?: 'cash' | 'card' | 'room_charge' | 'mobile';
  splitPayments?: Array<{
    amount: number;
    method: 'cash' | 'card' | 'room_charge' | 'mobile';
    reference?: string;
  }>;
  orderType: 'dine-in' | 'takeout' | 'delivery' | 'room-service' | 'kiosk' | 'qr-code';
  orderSource: 'server' | 'customer' | 'kiosk' | 'mobile' | 'room-service';
  server?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    table: { type: Schema.Types.ObjectId, ref: 'Table' },
    roomNumber: { type: String },
    customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
    items: [
      {
        menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        quantity: { type: Number, required: true, min: 1 },
        options: [
          {
            name: { type: String },
            choice: { type: String },
            priceAdjustment: { type: Number, default: 0 }
          }
        ],
        notes: { type: String },
        price: { type: Number, required: true }
      }
    ],
    status: { 
      type: String, 
      enum: ['pending', 'preparing', 'ready', 'delivered', 'completed', 'cancelled'], 
      default: 'pending' 
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    tip: { type: Number },
    total: { type: Number, required: true },
    paymentStatus: { 
      type: String, 
      enum: ['unpaid', 'partially_paid', 'paid'], 
      default: 'unpaid' 
    },
    paymentMethod: { 
      type: String, 
      enum: ['cash', 'card', 'room_charge', 'mobile']
    },
    splitPayments: [
      {
        amount: { type: Number, required: true },
        method: { 
          type: String, 
          enum: ['cash', 'card', 'room_charge', 'mobile'], 
          required: true 
        },
        reference: { type: String }
      }
    ],
    orderType: { 
      type: String, 
      enum: ['dine-in', 'takeout', 'delivery', 'room-service', 'kiosk', 'qr-code'], 
      required: true 
    },
    orderSource: { 
      type: String, 
      enum: ['server', 'customer', 'kiosk', 'mobile', 'room-service'], 
      required: true 
    },
    server: { type: Schema.Types.ObjectId, ref: 'User' },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

// Generate unique order number
OrderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const prefix = date.getFullYear().toString().slice(-2) + 
                  (date.getMonth() + 1).toString().padStart(2, '0') + 
                  date.getDate().toString().padStart(2, '0');
    
    const lastOrder = await mongoose.models.Order.findOne({}, {}, { sort: { 'orderNumber': -1 } });
    let counter = 1;
    
    if (lastOrder && lastOrder.orderNumber.startsWith(prefix)) {
      counter = parseInt(lastOrder.orderNumber.slice(6)) + 1;
    }
    
    this.orderNumber = `${prefix}-${counter.toString().padStart(4, '0')}`;
  }
  next();
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);