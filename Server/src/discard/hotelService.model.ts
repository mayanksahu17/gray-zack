import mongoose, { Document, Schema, Types } from 'mongoose';

// Define enum types for better type safety
enum ServiceType {
  RESTAURANT = 'restaurant',
  BAR = 'bar',
  SPA = 'spa',
  GYM = 'gym',
  POOL = 'pool'
}

enum ItemCategory {
  APPETIZER = 'appetizer',
  MAIN_COURSE = 'main_course',
  DESSERT = 'dessert',
  DRINK = 'drink',
  TREATMENT = 'treatment', // for spa
  SERVICE = 'service', // generic category
  OTHER = 'other'
}

// Interface for day hours
interface DayHours {
  open: string;
  close: string;
}

// Interface for operating hours
interface OperatingHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

// Interface for menu items
interface MenuItem {
  itemId: Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: ItemCategory;
  available: boolean;
  image?: string;
  tags?: string[];
}

// Main interface for the HotelService document
export interface IHotelService extends Document {
  hotelId: Types.ObjectId;
  name: string;
  type: ServiceType;
  menuItems: MenuItem[];
  operatingHours: OperatingHours;
  createdAt: Date;
  updatedAt: Date;
  
  // Instance methods
  isOpen(date?: Date): boolean;
  findItemById(itemId: Types.ObjectId | string): MenuItem | null;
  getAvailableItems(): MenuItem[];
  getItemsByCategory(category: ItemCategory): MenuItem[];
}

// Regex for time format validation (HH:MM in 24-hour format)
const TIME_FORMAT_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Schema for day hours
const DayHoursSchema = new Schema<DayHours>({
  open: {
    type: String,
    required: [true, 'Opening time is required'],
    validate: {
      validator: (value: string) => TIME_FORMAT_REGEX.test(value),
      message: 'Opening time must be in format HH:MM (24-hour)'
    }
  },
  close: {
    type: String,
    required: [true, 'Closing time is required'],
    validate: [
      {
        validator: (value: string) => TIME_FORMAT_REGEX.test(value),
        message: 'Closing time must be in format HH:MM (24-hour)'
      },
      {
        validator: function(this: any, close: string) {
          // Skip validation if open time is not in correct format
          if (!TIME_FORMAT_REGEX.test(this.open)) return true;
          
          // Convert times to comparable format (minutes since midnight)
          const openParts = this.open.split(':').map(Number);
          const closeParts = close.split(':').map(Number);
          
          const openMinutes = openParts[0] * 60 + openParts[1];
          const closeMinutes = closeParts[0] * 60 + closeParts[1];
          
          // Allow for 24-hour service (open == close)
          return closeMinutes === openMinutes || closeMinutes > openMinutes;
        },
        message: 'Closing time must be after opening time or equal for 24-hour service'
      }
    ]
  }
}, { _id: false });

// Schema for menu items
const MenuItemSchema = new Schema<MenuItem>({
  itemId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Item ID is required'],
    // We're using a custom itemId rather than relying on the _id
    // This allows for the same items to be used across different services or hotels
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    minlength: [2, 'Item name must be at least 2 characters long'],
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    enum: {
      values: Object.values(ItemCategory),
      message: '{VALUE} is not a valid item category'
    },
    required: [true, 'Item category is required']
  },
  available: {
    type: Boolean,
    default: true
  },
  image: {
    type: String,
    trim: true,
    validate: {
      validator: function(value: string) {
        // Skip validation if not provided
        if (!value) return true;
        
        // Basic URL validation for image
        return /^(https?:\/\/|\/|\.\.\/|\.\/)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/.test(value);
      },
      message: 'Image must be a valid URL or path'
    }
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags: string[]) {
        // Ensure no duplicate tags
        return new Set(tags).size === tags.length;
      },
      message: 'Duplicate tags are not allowed'
    }
  }
}, { _id: true });

// Main HotelService Schema
const HotelServiceSchema = new Schema<IHotelService>({
  hotelId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Hotel ID is required'],
    ref: 'Hotel'
  },
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    minlength: [2, 'Service name must be at least 2 characters long'],
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: {
      values: Object.values(ServiceType),
      message: '{VALUE} is not a valid service type'
    },
    required: [true, 'Service type is required']
  },
  menuItems: {
    type: [MenuItemSchema],
    default: [],
    validate: {
      validator: function(this: IHotelService, items: MenuItem[]) {
        // Skip validation for service types that may not have menu items
        if (this.type === ServiceType.GYM || this.type === ServiceType.POOL) {
          return true;
        }
        return items.length > 0;
      },
      message: 'Services of type restaurant, bar, or spa must have at least one menu item'
    }
  },
  operatingHours: {
    monday: { type: DayHoursSchema },
    tuesday: { type: DayHoursSchema },
    wednesday: { type: DayHoursSchema },
    thursday: { type: DayHoursSchema },
    friday: { type: DayHoursSchema },
    saturday: { type: DayHoursSchema },
    sunday: { type: DayHoursSchema }
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

// Pre-validation middleware to ensure menu items have valid categories based on service type
HotelServiceSchema.pre('validate', function(next) {
  // Skip validation if no menu items
  if (!this.menuItems || this.menuItems.length === 0) {
    return next();
  }
  
  // Define valid categories per service type
  const validCategories: Record<ServiceType, ItemCategory[]> = {
    [ServiceType.RESTAURANT]: [
      ItemCategory.APPETIZER, 
      ItemCategory.MAIN_COURSE, 
      ItemCategory.DESSERT, 
      ItemCategory.DRINK,
      ItemCategory.OTHER
    ],
    [ServiceType.BAR]: [
      ItemCategory.APPETIZER, 
      ItemCategory.DRINK,
      ItemCategory.OTHER
    ],
    [ServiceType.SPA]: [
      ItemCategory.TREATMENT, 
      ItemCategory.SERVICE,
      ItemCategory.OTHER
    ],
    [ServiceType.GYM]: [
      ItemCategory.SERVICE,
      ItemCategory.OTHER
    ],
    [ServiceType.POOL]: [
      ItemCategory.SERVICE,
      ItemCategory.OTHER
    ]
  };
  
  // Check that each item has a valid category for the service type
  const serviceType = this.type as ServiceType;
  const allowedCategories = validCategories[serviceType] || [];
  
  for (const item of this.menuItems) {
    if (!allowedCategories.includes(item.category as ItemCategory)) {
      this.invalidate(
        'menuItems',
        `Category "${item.category}" is not valid for service type "${serviceType}"`
      );
      break;
    }
  }
  
  next();
});

// Pre-save middleware to check for duplicate item IDs
HotelServiceSchema.pre('save', function(next) {
  if (!this.menuItems || this.menuItems.length === 0) {
    return next();
  }
  
  // Check for duplicate item IDs
  const itemIds = this.menuItems.map(item => item.itemId.toString());
  const uniqueItemIds = new Set(itemIds);
  
  if (itemIds.length !== uniqueItemIds.size) {
    return next(new Error('Duplicate item IDs are not allowed in menu items'));
  }
  
  next();
});

// Indexes for performance
HotelServiceSchema.index({ hotelId: 1, type: 1 }, { unique: true });
HotelServiceSchema.index({ 'menuItems.itemId': 1 });
HotelServiceSchema.index({ 'menuItems.category': 1 });
HotelServiceSchema.index({ 'menuItems.available': 1 });

// Instance methods
HotelServiceSchema.methods.isOpen = function(date?: Date): boolean {
  const targetDate = date || new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = days[targetDate.getDay()];
  
  const hoursForDay = this.operatingHours[day];
  if (!hoursForDay) return false;
  
  // Extract hours and minutes from the current time
  const currentHour = targetDate.getHours();
  const currentMinute = targetDate.getMinutes();
  const currentTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
  
  // Special case: 24-hour service
  if (hoursForDay.open === hoursForDay.close) return true;
  
  // Compare current time with operating hours
  return currentTimeStr >= hoursForDay.open && currentTimeStr < hoursForDay.close;
};

HotelServiceSchema.methods.findItemById = function(itemId: Types.ObjectId | string): MenuItem | null {
  const itemIdStr = itemId.toString();
  return this.menuItems.find((item : any) => item.itemId.toString() === itemIdStr) || null;
};

HotelServiceSchema.methods.getAvailableItems = function(): MenuItem[] {
  return this.menuItems.filter((item : any) => item.available);
};

HotelServiceSchema.methods.getItemsByCategory = function(category: ItemCategory): MenuItem[] {
  return this.menuItems.filter((item : any) => item.category === category);
};

// Virtual properties
HotelServiceSchema.virtual('itemCount').get(function(this: IHotelService) {
  return this.menuItems.length;
});

HotelServiceSchema.virtual('availableItemCount').get(function(this: IHotelService) {
  return this.menuItems.filter(item => item.available).length;
});

HotelServiceSchema.virtual('categories').get(function(this: IHotelService) {
  return [...new Set(this.menuItems.map(item => item.category))];
});

// Create and export the model
const HotelService = mongoose.model<IHotelService>('HotelService', HotelServiceSchema);

export { 
  HotelService, 
  ServiceType, 
  ItemCategory 
};