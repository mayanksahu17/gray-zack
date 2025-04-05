import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from "jsonwebtoken";

// Define enum types for better type safety
enum AdminRole {
  SYSTEM_ADMIN = 'system_admin',
  HOTEL_ADMIN = 'hotel_admin',
  STAFF_ADMIN = 'staff_admin'
}

enum AdminStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

// Define the possible permission types
enum AdminPermission {
  CREATE_HOTEL = 'create_hotel',
  MANAGE_SUBSCRIPTIONS = 'manage_subscriptions',
  VIEW_ALL_DATA = 'view_all_data',
  MANAGE_USERS = 'manage_users',
  SYSTEM_SETTINGS = 'system_settings',
  AUDIT_LOGS = 'audit_logs',
  SUPPORT_TICKETS = 'support_tickets'
}

// Interface defining the Administrator document structure
export interface IAdministrator extends Document {
  name: string;
  email: string;
  phone: string;
  role: AdminRole;
  permissions: AdminPermission[];
  password: string;
  status: AdminStatus;
  createdAt: Date;
  updatedAt: Date;
  refreshToken: string;
  accessToken : string;
  
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  isActive(): boolean;
  hasPermission(permission: AdminPermission): boolean;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// Interface for the Administrator model
export interface IAdministratorModel extends Model<IAdministrator> {
  // Static methods
  findByEmail(email: string): Promise<IAdministrator | null>;
}

// Create the Administrator schema
const AdministratorSchema = new Schema<IAdministrator>(
  {
    name: {
      type: String,
      required: [true, 'Administrator name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
        'Please provide a valid email address'
      ]
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [
        /^\+\d{1,3}-\d{3}-\d{3}-\d{4}$/,
        'Phone number must be in format: +1-555-987-6543'
      ]
    },
    role: {
      type: String,
      enum: {
        values: Object.values(AdminRole),
        message: '{VALUE} is not a valid role'
      },
      required: [true, 'Administrator role is required']
    },
    permissions: {
      type: [{
        type: String,
        enum: {
          values: Object.values(AdminPermission),
          message: '{VALUE} is not a valid permission'
        }
      }],
      validate: {
        validator: function(permissions: string[]) {
          // Ensure there are no duplicate permissions
          return new Set(permissions).size === permissions.length;
        },
        message: 'Duplicate permissions are not allowed'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false // Don't include password in query results by default
    },
    status: {
      type: String,
      enum: {
        values: Object.values(AdminStatus),
        message: '{VALUE} is not a valid status'
      },
      default: AdminStatus.ACTIVE
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true // Once set, cannot be changed
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    refreshToken: {
      type: String
    },
    accessToken: {
      type: String
    }


  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Ensure password is never serialized to JSON
        return ret;
      }
    }
  }
);

// Index for improved query performance
AdministratorSchema.index({ email: 1 }, { unique: true });
AdministratorSchema.index({ role: 1 });
AdministratorSchema.index({ status: 1 });

// Pre-save middleware to hash password
AdministratorSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Instance method to compare passwords
AdministratorSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

// Instance method to check if admin is active
AdministratorSchema.methods.isActive = function(): boolean {
  return this.status === AdminStatus.ACTIVE;
};

// Instance method to check if admin has specific permission
AdministratorSchema.methods.hasPermission = function(permission: AdminPermission): boolean {
  return this.permissions.includes(permission);
};

// Static method to find admin by email
AdministratorSchema.statics.findByEmail = function(email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

// Change from statics to methods
AdministratorSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN_SECRET || 'fallback-secret',
    { expiresIn: '1d' }
  );
};

AdministratorSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret',
    { expiresIn: '7d' }
  );
};

// Create and export the model
const Administrator = mongoose.model<IAdministrator, IAdministratorModel>('Administrator', AdministratorSchema);

export { Administrator, AdminRole, AdminStatus, AdminPermission };