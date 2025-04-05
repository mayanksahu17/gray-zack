import mongoose, { Document, Schema, Types } from 'mongoose';

// Define enum types for better type safety
enum CuisineType {
  ITALIAN = 'italian',
  CHINESE = 'chinese',
  INDIAN = 'indian',
  MEXICAN = 'mexican',
  JAPANESE = 'japanese',
  AMERICAN = 'american',
  MEDITERRANEAN = 'mediterranean',
  FRENCH = 'french',
  THAI = 'thai',
  OTHER = 'other'
}

enum DishCategory {
  APPETIZER = 'appetizer',
  SOUP = 'soup',
  SALAD = 'salad',
  MAIN_COURSE = 'main_course',
  DESSERT = 'dessert',
  BEVERAGE = 'beverage',
  SIDE = 'side',
  SPECIAL = 'special'
}

enum PriceRange {
  BUDGET = '$',
  MODERATE = '$$',
  UPSCALE = '$$$',
  FINE_DINING = '$$$$'
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

// Interface for table
interface Table {
  tableNumber: string;
  capacity: number;
  location: 'indoor' | 'outdoor' | 'bar';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  features?: string[];
  currentOrder?: Types.ObjectId;
}

// New interfaces for menu items and categories
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  allergens?: string[];
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  spicyLevel?: number;
  available?: boolean;
  popular?: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

// Main interface for the Restaurant document
export interface IRestaurant extends Document {
  hotelId: Types.ObjectId;
  name: string;
  description: string;
  priceRange: PriceRange;
  email?: string;
  operatingHours: OperatingHours;
  reservationRequired: boolean;
  takeout: boolean;
  delivery: boolean;
  capacity: number;
  averageRating?: number;
  reviewCount?: number;
  images?: string[];
  established?: Date;
  tables: Table[];
  menu: MenuCategory[]; // New field for menu
  createdAt: Date;
  updatedAt: Date;
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

// Schema for table
const TableSchema = new Schema<Table>({
  tableNumber: {
    type: String,
    required: [true, 'Table number is required'],
    trim: true,
    unique: true
  },
  capacity: {
    type: Number,
    required: [true, 'Table capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  location: {
    type: String,
    enum: ['indoor', 'outdoor', 'bar'],
    required: [true, 'Table location is required']
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available'
  },
  features: [{
    type: String,
    trim: true
  }],
  currentOrder: {
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }
}, { _id: true });

// Schema for menu item
const MenuItemSchema = new Schema<MenuItem>({
  id: {
    type: String,
    required: [true, 'Menu item ID is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    minlength: [2, 'Menu item name must be at least 2 characters long'],
    maxlength: [100, 'Menu item name cannot exceed 100 characters']
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
  image: {
    type: String,
    validate: {
      validator: function(url: string) {
        // Skip validation if not provided
        if (!url) return true;
        
        return /^(https?:\/\/|\/|\.\.\/|\.\/)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/.test(url);
      },
      message: 'Image must have a valid URL or path'
    }
  },
  allergens: [{
    type: String,
    trim: true
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  spicyLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  available: {
    type: Boolean,
    default: true
  },
  popular: {
    type: Boolean,
    default: false
  }
}, { _id: false });

// Schema for menu category
const MenuCategorySchema = new Schema<MenuCategory>({
  id: {
    type: String,
    required: [true, 'Category ID is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters long'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  items: {
    type: [MenuItemSchema],
    default: [],
    validate: {
      validator: function(items: MenuItem[]) {
        // Ensure unique item IDs within a category
        const itemIds = items.map(item => item.id);
        return new Set(itemIds).size === itemIds.length;
      },
      message: 'Menu item IDs must be unique within a category'
    }
  }
}, { _id: false });

// Main Restaurant Schema
const RestaurantSchema = new Schema<IRestaurant>({
  hotelId: {
    type: Schema.Types.ObjectId,
    required: [true, 'Hotel ID is required'],
    ref: 'Hotel'
  },
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    minlength: [2, 'Restaurant name must be at least 2 characters long'],
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Restaurant description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  priceRange: {
    type: String,
    enum: {
      values: Object.values(PriceRange),
      message: '{VALUE} is not a valid price range'
    },
    required: [true, 'Price range is required']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        // Skip validation if not provided
        if (!v) return true;
        
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
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
  },
  reservationRequired: {
    type: Boolean,
    default: false
  },
  takeout: {
    type: Boolean,
    default: true
  },
  delivery: {
    type: Boolean,
    default: false
  },
  capacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: [1, 'Capacity must be at least 1']
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  },
  images: {
    type: [String],
    validate: {
      validator: function(urls: string[]) {
        // Skip validation if not provided
        if (!urls || urls.length === 0) return true;
        
        // Validate all URLs
        return urls.every(url => 
          /^(https?:\/\/|\/|\.\.\/|\.\/)[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]+$/.test(url)
        );
      },
      message: 'All images must have valid URLs or paths'
    }
  },
  established: {
    type: Date
  },
  tables: {
    type: [TableSchema],
    default: [],
    validate: {
      validator: function(tables: Table[]) {
        // Ensure unique table numbers
        const uniqueTableNumbers = tables.map((table: Table) => table.tableNumber);
        return new Set(uniqueTableNumbers).size === uniqueTableNumbers.length;
      },
      message: 'Table numbers must be unique'
    }
  },
  // Add menu field to the schema
  menu: {
    type: [MenuCategorySchema],
    default: [],
    validate: {
      validator: function(categories: MenuCategory[]) {
        // Ensure unique category IDs
        const categoryIds = categories.map(category => category.id);
        return new Set(categoryIds).size === categoryIds.length;
      },
      message: 'Menu category IDs must be unique'
    }
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
RestaurantSchema.index({ name: 1 });
RestaurantSchema.index({ 'cuisine': 1 });
RestaurantSchema.index({ 'location.city': 1, 'location.country': 1 });
RestaurantSchema.index({ priceRange: 1 });
RestaurantSchema.index({ averageRating: -1 });
RestaurantSchema.index({ 'menu.id': 1 }); // Index for menu categories
RestaurantSchema.index({ 'menu.items.id': 1 }); // Index for menu items

// Instance methods
RestaurantSchema.methods.isOpen = function(date?: Date): boolean {
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

// Instance methods for table management
RestaurantSchema.methods.getAvailableTables = function(): Table[] {
  return this.tables.filter((table: Table) => table.status === 'available');
};

RestaurantSchema.methods.findTableByNumber = function(tableNumber: string): Table | null {
  return this.tables.find((table: Table) => table.tableNumber === tableNumber) || null;
};

// New methods for menu management
RestaurantSchema.methods.findCategoryById = function(categoryId: string): MenuCategory | null {
  return this.menu.find((category: MenuCategory) => category.id === categoryId) || null;
};

RestaurantSchema.methods.findItemById = function(itemId: string): MenuItem | null {
  for (const category of this.menu) {
    const item = category.items.find((item: MenuItem) => item.id === itemId);
    if (item) return item;
  }
  return null;
};

RestaurantSchema.methods.getAvailableItems = function(): MenuItem[] {
  const availableItems: MenuItem[] = [];
  for (const category of this.menu) {
    availableItems.push(...category.items.filter((item: MenuItem) => item.available));
  }
  return availableItems;
};

RestaurantSchema.methods.getPopularItems = function(): MenuItem[] {
  const popularItems: MenuItem[] = [];
  for (const category of this.menu) {
    popularItems.push(...category.items.filter((item: MenuItem) => item.popular));
  }
  return popularItems;
};

// Create and export the model
const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);

export { 
  Restaurant, 
  CuisineType, 
  DishCategory,
  PriceRange,
  MenuItem,
  MenuCategory
};