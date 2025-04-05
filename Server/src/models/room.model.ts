import mongoose, { Document, Schema, Types } from 'mongoose';

// Define enum for room types
enum RoomType {
  STANDARD = 'standard',
  DELUXE = 'deluxe',
  SUITE = 'suite',
  ACCESSIBLE = 'Accessible'
}

// Define enum for room status
enum RoomStatus {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance',
  CLEANING = 'cleaning',
  OUT_OF_ORDER = 'out of order'
}

// Room interface
export interface IRoomDocument extends Document {
  hotelId: Types.ObjectId;
  roomNumber: string;
  type: RoomType;
  floor: number;
  beds: string,
  capacity: number;
  amenities: string[];
  pricePerNight: number;
  status: RoomStatus;
  lastCleaned: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Room schema
const roomSchema = new Schema<IRoomDocument>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Hotel ID is required'],
      ref: 'Hotel' // Reference to Hotel model, but not creating a new model
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
      index: true
    },
    type: {
      type: String,
      required: [true, 'Room type is required'],
      enum: Object.values(RoomType),
      default: RoomType.STANDARD
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required'],
      min: [0, 'Floor number cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Floor number must be an integer'
      }
    },
    beds : {
      type : String,
      required : [true, 'beds number is required']
    },
    capacity: {
      type: Number,
      required: [true, 'Room capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [10, 'Capacity cannot exceed 10'],
      validate: {
        validator: Number.isInteger,
        message: 'Capacity must be an integer'
      }
    },
    amenities: [{
      type: String,
      trim: true
    }],
    pricePerNight: {
      type: Number,
      required: [true, 'Price per night is required'],
      min: [0, 'Price cannot be negative'],
      get: (v: number) => parseFloat(v.toFixed(2)),
      set: (v: number) => parseFloat(v.toFixed(2))
    },
    status: {
      type: String,
      required: [true, 'Room status is required'],
      enum: Object.values(RoomStatus),
      default: RoomStatus.AVAILABLE
    },
    lastCleaned: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Don't add __v field
  }
);

// Add compound index for efficient querying
roomSchema.index({ hotelId: 1, roomNumber: 1 }, { unique: true });
roomSchema.index({ hotelId: 1, status: 1 });
roomSchema.index({ hotelId: 1, type: 1 });
roomSchema.index({ hotelId: 1, floor: 1 });

// Virtual for room identifier (e.g., "Floor 3 - Room 301")
roomSchema.virtual('roomIdentifier').get(function(this: IRoomDocument) {
  return `Floor ${this.floor} - Room ${this.roomNumber}`;
});

// Method to check if room needs cleaning (e.g., hasn't been cleaned in 24 hours)
roomSchema.methods.needsCleaning = function(this: IRoomDocument): boolean {
  if (!this.lastCleaned) return true;
  
  const CLEANING_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const timeSinceCleaning = Date.now() - this.lastCleaned.getTime();
  return timeSinceCleaning > CLEANING_INTERVAL;
};

// Pre-save middleware for validation or data manipulation
roomSchema.pre('save', function(next) {
  // Ensure room number follows hotel's format convention if needed
  // For example, ensuring it's a string even if numbers are provided
  this.roomNumber = String(this.roomNumber).trim();
  
  // Additional validation or business logic can be added here
  next();
});

// Create and export the model
const Room = mongoose.model<IRoomDocument>('Room', roomSchema);
export default Room;