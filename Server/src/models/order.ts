    // models/Order.ts

    import mongoose, { Schema, Document } from 'mongoose';

    interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    }

    export interface IOrder extends Document {
    id: string;
    customer: string;
    date: string;
    items: number;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    type: 'dine-in' | 'takeaway' | 'delivery';
    table?: string;
    payment: 'cash' | 'card' | 'online';
    paymentId: string;
    details: OrderItem[];
    }

    const OrderItemSchema: Schema = new Schema<OrderItem>(
    {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    },
    { _id: false }
    );

    const OrderSchema: Schema = new Schema<IOrder>({
    id: { type: String, required: true, unique: true },
    customer: { type: String, required: true },
    date: { type: String, required: true },
    items: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], required: true },
    type: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], required: true },
    table: { type: String }, // optional
    payment: { type: String, enum: ['cash', 'card', 'online'], required: true },
    paymentId: { type: String, required: true },
    details: { type: [OrderItemSchema], required: true },
    });

    export default mongoose.model<IOrder>('Order', OrderSchema);
