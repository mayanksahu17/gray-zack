import mongoose, { Document, Schema, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from "jsonwebtoken";

// Define enum for staff roles
enum StaffRole {
  FRONT_DESK = 'front_desk',
  HOUSEKEEPER = 'housekeeper',
  RESTAURANT_MANAGER = 'restaurant_manager',
  SPA_MANAGER = 'spa_manager',
  HOTEL_OWNER = 'hotel_owner',
  ADMIN = 'admin'
}

// Define enum for staff status
enum StaffStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Staff member interface
export interface IStaffDocument extends Document {
  hotelId: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  permissions: string[];
  password: string;
  status: StaffStatus;
  refreshToken: string;
  accessToken : string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
  isActive(): boolean;
}

// Staff schema
const staffSchema = new Schema<IStaffDocument>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Hotel ID is required'],
      ref: 'Hotel' // Reference to Hotel model, not creating a new model
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function(v: string) {
          return /^[+]?[\d\s-()]+$/.test(v);
        },
        message: props => `${props.value} is not a valid phone number!`
      }
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: Object.values(StaffRole),
      default: StaffRole.FRONT_DESK
    },
    permissions: [{
      type: String,
      trim: true
    }],
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't include password in query results by default
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: Object.values(StaffStatus),
      default: StaffStatus.ACTIVE
    },
    refreshToken: {
      type: String
    },
    accessToken: {
      type: String
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false // Don't add __v field
  }
);

// Add indexes for efficient querying
staffSchema.index({ email: 1 }, { unique: true });
staffSchema.index({ hotelId: 1, role: 1 });
staffSchema.index({ hotelId: 1, status: 1 });

// Pre-save middleware to hash password before saving
staffSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare entered password with stored hash
staffSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};
// Change from statics to methods
staffSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN_SECRET || 'fallback-secret',
    { expiresIn: '1d' }
  );
};

staffSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret',
    { expiresIn: '7d' }
  );
};

// Virtual for staff member's access level (numeric representation of role privileges)
staffSchema.virtual('accessLevel').get(function(this: IStaffDocument) {
  const accessLevels: Record<StaffRole, number> = {
    [StaffRole.FRONT_DESK]: 1,
    [StaffRole.HOUSEKEEPER]: 1,
    [StaffRole.RESTAURANT_MANAGER]: 2,
    [StaffRole.SPA_MANAGER]: 2,
    [StaffRole.HOTEL_OWNER]: 3,
    [StaffRole.ADMIN]: 4
  };
  
  return accessLevels[this.role] || 0;
});

// Create and export the model
const Staff = mongoose.model<IStaffDocument>('Staff', staffSchema);
export default Staff; 

export { StaffRole };