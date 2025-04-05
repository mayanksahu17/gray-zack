import mongoose, { Document, Schema } from 'mongoose';

export interface ITable extends Document {
  tableNumber: number;
  seats: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  section?: string;
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TableSchema = new Schema<ITable>(
  {
    tableNumber: { type: Number, required: true, unique: true },
    seats: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ['available', 'occupied', 'reserved', 'maintenance'], 
      default: 'available' 
    },
    section: { type: String },
    qrCode: { type: String }
  },
  { timestamps: true }
);

export default mongoose.models.Table || mongoose.model<ITable>('Table', TableSchema);