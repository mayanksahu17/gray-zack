import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Restaurant, MenuItem,  } from '../models/restaurant.model';
import { v4 as uuidv4 } from 'uuid';
// ==========================================
// Restaurant Information Controllers
// ==========================================

/**
 * Get restaurant details by ID
 */
export const getRestaurantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.status(200).json({ success: true, data: restaurant });
  } catch (error : any) {
    console.error('Error fetching restaurant:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Create a new restaurant
 */
export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantData = req.body;

    const restaurant = new Restaurant(restaurantData);
    await restaurant.validate();
    await restaurant.save();

    return res.status(201).json({ success: true, data: restaurant });
  } catch (error : any) {
    console.error('Error creating restaurant:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update restaurant details
 */
export const updateRestaurant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.status(200).json({ success: true, data: restaurant });
  } catch (error : any) {
    console.error('Error updating restaurant:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Check if restaurant is currently open
//  */
// export const checkRestaurantOpen = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
//     }

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ success: false, message: 'Restaurant not found' });
//     }

//     const isOpen = restaurant.isOpen();

//     return res.status(200).json({
//       success: true,
//       data: {
//         isOpen,
//         currentDay: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
//         hours: restaurant.operatingHours
//       }
//     });
//   } catch (error) {
//     console.error('Error checking restaurant status:', error);
//     return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// ==========================================
// Menu Management Controllers
// ==========================================

/**
 * Get restaurant's complete menu
 */
export const getRestaurantMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id, 'name menu');

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        restaurantName: restaurant.name,
        menu: restaurant.menu
      }
    });
  } catch (error : any) {
    console.error('Error fetching menu:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Add a new menu category
 */
export const addMenuCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const categoryData = req.body
    const categoryId = categoryData?.id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' })
    }

    const restaurant = await Restaurant.findById(id)

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' })
    }

    const existingCategoryIndex = restaurant.menu.findIndex(c => c.id === categoryData.id)

    if (existingCategoryIndex !== -1) {
      // Category exists, append new items
      const existingCategory = restaurant.menu[existingCategoryIndex]
      const newItems = categoryData.items || []

      // Filter out items with duplicate IDs
      const existingItemIds = new Set(existingCategory.items.map(item => item.id))
      const uniqueNewItems = newItems.filter((item : any) => !existingItemIds.has(item.id))

      if (uniqueNewItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'All item IDs already exist in this category'
        })
      }

      // Append unique new items to the existing category
      restaurant.menu[existingCategoryIndex].items.push(...uniqueNewItems)

      await restaurant.save()
      return res.status(200).json({
        success: true,
        message: 'New items added to existing category',
        updatedCategory: restaurant.menu[existingCategoryIndex]
      })
    } else {
      // Category does not exist — create new category
      restaurant.menu.push(categoryData)
      await restaurant.save()

      return res.status(201).json({
        success: true,
        message: 'New menu category added successfully',
        newCategory: categoryData
      })
    }
  } catch (error: any) {
    console.error('Error adding or updating menu category:', error)
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
}


/**
 * Update an existing menu category
//  */
// export const updateMenuCategory = async (req: Request, res: Response) => {
//   try {
//     const { restaurantId, categoryId } = req.params;
//     const updateData = req.body;

//     if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
//       return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
//     }

//     const restaurant = await Restaurant.findById(restaurantId);

//     if (!restaurant) {
//       return res.status(404).json({ success: false, message: 'Restaurant not found' });
//     }

//     const categoryIndex = restaurant.menu.findIndex(c => c.id === categoryId);
//     if (categoryIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: `Category with ID ${categoryId} not found`
//       });
//     }

//     // Preserve items if not provided in update
//     if (!updateData.items) {
//       updateData.items = restaurant.menu[categoryIndex].items;
//     }
     
//     restaurant.menu[categoryIndex] = {
//       ...restaurant.menu[categoryIndex].toObject(),
//       ...updateData
//     };

//     await restaurant.save();

//     return res.status(200).json({
//       success: true,
//       data: restaurant.menu[categoryIndex],
//       message: 'Menu category updated successfully'
//     });
//   } catch (error : any) {
//     console.error('Error updating menu category:', error);
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({ success: false, message: error.message });
//     }
//     return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

/**
 * Delete a menu category
 */
export const deleteMenuCategory = async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const categoryIndex = restaurant.menu.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryId} not found`
      });
    }

    restaurant.menu.splice(categoryIndex, 1);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: 'Menu category deleted successfully'
    });
  } catch (error : any) {
    console.error('Error deleting menu category:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Add a menu item to a category
 */
export const addMenuItem = async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId } = req.params;
    const itemData = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const categoryIndex = restaurant.menu.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryId} not found`
      });
    }

    // Check if item ID already exists in this category
    const existingItem = restaurant.menu[categoryIndex].items.find(i => i.id === itemData.id);
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: `Item with ID ${itemData.id} already exists in this category`
      });
    }

    restaurant.menu[categoryIndex].items.push(itemData);
    await restaurant.save();

    return res.status(201).json({
      success: true,
      data: itemData,
      message: 'Menu item added successfully'
    });
  } catch ( error: any) {
    console.error('Error adding menu item:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update a menu item
//  */

export const updateMenuItem = async (req: Request, res: Response) => {
  try {
    const { restaurantId, itemId } = req.params;
    const updateData = req.body;
    console.log(restaurantId);
    
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById( restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const categoryIndex = restaurant.menu.findIndex((c) => {
      console.log(c.id);
      if(c.id === updateData.categoryId) {
        console.log("found");
      return c.id;
    }} );
    if (categoryIndex === -1) {
      return res.status(404).json({ success: false, message: `Category with ID ${updateData.categoryId} not found` });
    }

    const itemIndex = restaurant.menu[categoryIndex].items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: `Item with ID ${itemId} not found in this category` });
    }

    console.log('Original item:', restaurant.menu[categoryIndex].items[itemIndex]);
    console.log('Update data received:', updateData);

    // Remove categoryId from updateData as it's not a property of the menu item itself
    // It's used for routing but shouldn't be saved in the item object
    const { categoryId: receivedCategoryId, ...cleanUpdateData } = updateData;

    // Update the item properties
    restaurant.menu[categoryIndex].items[itemIndex] = {
      ...restaurant.menu[categoryIndex].items[itemIndex],
      ...cleanUpdateData,
      id: itemId // Ensure ID remains unchanged
    };

    console.log('Updated item:', restaurant.menu[categoryIndex].items[itemIndex]);

    // Save the updated restaurant document
    await restaurant.save();

    return res.status(200).json({ 
      success: true, 
      data: restaurant.menu[categoryIndex].items[itemIndex], 
      message: 'Menu item updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating menu item:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};  

/**
 * Delete a menu item
 */
export const deleteMenuItem = async (req: Request, res: Response) => {
  try {
    const { restaurantId, categoryId, itemId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const categoryIndex = restaurant.menu.findIndex(c => c.id === categoryId);
    if (categoryIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Category with ID ${categoryId} not found`
      });
    }

    const itemIndex = restaurant.menu[categoryIndex].items.findIndex(i => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${itemId} not found in this category`
      });
    }

    restaurant.menu[categoryIndex].items.splice(itemIndex, 1);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error : any) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get popular menu items
//  */
// export const getPopularItems = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
//     }

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ success: false, message: 'Restaurant not found' });
//     }

//     const popularItems = restaurant.getPopularItems();

//     return res.status(200).json({
//       success: true,
//       data: popularItems
//     });
//   } catch (error : any) {
//     console.error('Error fetching popular items:', error);
//     return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

// ==========================================
// Table Management Controllers
// ==========================================

/**
 * Get all tables for a restaurant
 */
export const getRestaurantTables = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id, 'tables');

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    return res.status(200).json({
      success: true,
      data: restaurant.tables
    });
  } catch (error : any) {
    console.error('Error fetching tables:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Add a new table to the restaurant
 */
export const addRestaurantTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tableData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Check if table number already exists
    const existingTable = restaurant.tables.find(t => t.tableNumber === tableData.tableNumber);
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: `Table with number ${tableData.tableNumber} already exists`
      });
    }

    restaurant.tables.push(tableData);
    await restaurant.save();

    return res.status(201).json({
      success: true,
      data: tableData,
      message: 'Table added successfully'
    });
  } catch (error : any) {
    console.error('Error adding table:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Update a table's information
 */
export const updateRestaurantTable = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber } = req.params;
    const updateData = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const tableIndex = restaurant.tables.findIndex(t => t.tableNumber === tableNumber);
    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Table with number ${tableNumber} not found`
      });
    }

    // If tableNumber is being updated, ensure it doesn't conflict with existing tables
    if (updateData.tableNumber && updateData.tableNumber !== tableNumber) {
      const existingTable = restaurant.tables.find(t => t.tableNumber === updateData.tableNumber);
      if (existingTable) {
        return res.status(400).json({
          success: false,
          message: `Table with number ${updateData.tableNumber} already exists`
        });
      }
    }

    restaurant.tables[tableIndex] = {
      ...restaurant.tables[tableIndex],
      ...updateData
    };

    await restaurant.save();

    return res.status(200).json({
      success: true,
      data: restaurant.tables[tableIndex],
      message: 'Table updated successfully'
    });
  } catch (error : any) {
    console.error('Error updating table:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Delete a table
 */
export const deleteRestaurantTable = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const tableIndex = restaurant.tables.findIndex(t => t.tableNumber === tableNumber);
    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Table with number ${tableNumber} not found`
      });
    }

    // Check if table is in use
    if (restaurant.tables[tableIndex].status === 'occupied') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete table ${tableNumber} because it is currently occupied`
      });
    }

    restaurant.tables.splice(tableIndex, 1);
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: 'Table deleted successfully'
    });
  } catch (error : any) {
    console.error('Error deleting table:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get available tables
//  */
// export const getAvailableTables = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
//     }

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ success: false, message: 'Restaurant not found' });
//     }

//     const availableTables = restaurant.getAvailableTables();

//     return res.status(200).json({
//       success: true,
//       data: availableTables
//     });
//   } catch (error : any) {
//     console.error('Error fetching available tables:', error);
//     return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

/**
 * Update table status (available, occupied, reserved, maintenance)
 */
export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber } = req.params;
    const { status, orderId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    if (orderId && !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ success: false, message: 'Invalid order ID format' });
    }

    const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const tableIndex = restaurant.tables.findIndex(t => t.tableNumber === tableNumber);
    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Table with number ${tableNumber} not found`
      });
    }

    restaurant.tables[tableIndex].status = status;
    
    // Update current order if provided
    if (status === 'occupied' && orderId) {
      restaurant.tables[tableIndex].currentOrder = orderId;
    } else if (status === 'available') {
      restaurant.tables[tableIndex].currentOrder = undefined;
    }

    await restaurant.save();

    return res.status(200).json({
      success: true,
      data: restaurant.tables[tableIndex],
      message: `Table status updated to ${status}`
    });
  } catch (error : any) {
    console.error('Error updating table status:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ==========================================
// POS-Specific Controllers
// ==========================================

/**
 * Search menu items across all categories
 */
export const searchMenuItems = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { query } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    const searchTerm = String(query).toLowerCase();
    const results: Array<{item: MenuItem, category: string}> = [];

    restaurant.menu.forEach(category => {
      const matchedItems = category.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        (item.description && item.description.toLowerCase().includes(searchTerm))
      );

      matchedItems.forEach(item => {
        results.push({
          item,
          category: category.name
        });
      });
    });

    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error : any) {
    console.error('Error searching menu items:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get quick stats for the restaurant dashboard
 */
// export const getRestaurantStats = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
//     }

//     const restaurant = await Restaurant.findById(id);

//     if (!restaurant) {
//       return res.status(404).json({ success: false, message: 'Restaurant not found' });
//     }

//     // Count tables by status
//     const tableStats = {
//       total: restaurant.tables.length,
//       available: restaurant.tables.filter(t => t.status === 'available').length,
//       occupied: restaurant.tables.filter(t => t.status === 'occupied').length,
//       reserved: restaurant.tables.filter(t => t.status === 'reserved').length,
//       maintenance: restaurant.tables.filter(t => t.status === 'maintenance').length
//     };

//     // Count menu items by category
//     const menuStats = restaurant.menu.map(category => ({
//       category: category.name,
//       itemCount: category.items.length
//     }));

//     // Calculate menu diversity
//     const totalItems = restaurant.menu.reduce((sum, category) => sum + category.items.length, 0);

//     return res.status(200).json({
//       success: true,
//       data: {
//         isOpen: restaurant.isOpen(),
//         tableStats,
//         menuStats,
//         totalItems,
//         totalCategories: restaurant.menu.length,
//         averageRating: restaurant.averageRating,
//         reviewCount: restaurant.reviewCount
//       }
//     });
//   } catch (error : any) {
//     console.error('Error fetching restaurant stats:', error);
//     return res.status(500).json({ success: false, message: 'Server error', error: error.message });
//   }
// };

/**
 * Export full menu data (for printing, PDF generation, etc.)
 */
export const exportMenuData = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id, 'name description priceRange menu');

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Process menu data for export
    const processedMenu = restaurant.menu.map(category => {
      const items = category.items.map(item => ({
        name: item.name,
        description: item.description || '',
        price: item.price,
        isVegetarian: item.isVegetarian || false,
        isVegan: item.isVegan || false,
        isGlutenFree: item.isGlutenFree || false,
        allergens: item.allergens || [],
        spicyLevel: item.spicyLevel || 0
      }));

      return {
        name: category.name,
        description: category.description || '',
        items
      };
    });

    const exportData = {
      restaurantName: restaurant.name,
      description: restaurant.description,
      priceRange: restaurant.priceRange,
      exportDate: new Date(),
      menu: processedMenu
    };

    return res.status(200).json({
      success: true,
      data: exportData
    });
  } catch (error : any) {
    console.error('Error exporting menu data:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

/**
 * Get available menu items by category (optimized for POS ordering)
 */
export const getAvailableMenuByCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid restaurant ID format' });
    }

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }

    // Filter menu to only include available items within each category
    const availableMenu = restaurant.menu.map(category => ({
      id: category.id,
      name: category.name,
      items: category.items.filter(item => item.available !== false)
    }));

    return res.status(200).json({
      success: true,
      data: availableMenu
    });
  } catch (error : any) {
    console.error('Error fetching available menu:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};



/**
 * Batch update multiple menu items (e.g., mark items as unavailable)
 */














/**
 * Process payment for an order
 * @route POST /api/v1/payments/process
 * @access Public
 */


export const processPayment = async (req: Request, res: Response) => {

try {
  const { amount, currency, paymentMethod, cardDetails } = req.body;

  // Validate required fields
  if (!amount || !currency || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: 'Amount, currency, and payment method are required',
    });
  }

  // Validate payment method
  const validPaymentMethods = ['cash', 'card', 'wallet', 'qr'];
  if (!validPaymentMethods.includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid payment method',
    });
  }

  // Validate card details if payment method is card
  if (paymentMethod === 'card') {
    if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      return res.status(400).json({
        success: false,
        message: 'Card details are required for card payment',
      });
    }
    
    // Basic card validation
    if (cardDetails.cardNumber.replace(/\s/g, '').length < 14) {
      return res.status(400).json({
        success: false,
        message: 'Invalid card number',
      });
    }
  }

  // In a real application, you would integrate with a payment gateway like Stripe or PayPal here
  // For this dummy implementation, we'll simulate a payment response

  // Generate unique IDs for the transaction
  const paymentId = uuidv4();
  const transactionId = `TXN-${Date.now()}`;
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a payment record in the database (pseudocode)
  // const payment = await Payment.create({
  //   paymentId,
  //   transactionId,
  //   amount,
  //   currency,
  //   paymentMethod,
  //   status: 'completed',
  //   timestamp: new Date(),
  // });

  // Return success response with payment details
  return res.status(200).json({
    success: true,
    message: 'Payment processed successfully',
    data: {
      paymentId,
      transactionId,
      amount,
      currency,
      status: 'completed',
      timestamp: new Date().toISOString(),
    },
  });
} catch (error : any) {
  console.error('Payment processing error:', error);
  return res.status(500).json({
    success: false,
    message: 'An error occurred while processing the payment',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
}

};




/**
 * Get payment details
 * @route GET /api/v1/payments/:paymentId
 * @access Private
 */
const getPaymentDetails =  async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    
    // In a real application, you would fetch the payment from your database
    // For this dummy implementation, we'll return a not found error
    
    return res.status(404).json({
      success: false,
      message: 'Payment not found',
    });
    
    // If found, you would return the payment details
    // return res.status(200).json({
    //   success: true,
    //   data: payment,
    // });
  } catch (error : any) {
    console.error('Error fetching payment:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the payment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};





/**
 * Create a new order
 * @route POST /api/v1/orders
 * @access Public
 */
export const createOrder = async  (req: Request, res: Response) => {
  try {
    const { 
      items,
      subtotal,
      tax,
      discount,
      total,
      diningOption,
      tableNumber,
      paymentMethod,
      customerDetails,
      orderNumber,
      timestamp,
      paymentId,
      paymentStatus,
      transactionId
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item',
      });
    }

    if (!subtotal || !total || !diningOption || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Missing required order details',
      });
    }

    // Validate dining option
    if (diningOption === 'dine-in' && !tableNumber) {
      return res.status(400).json({
        success: false,
        message: 'Table number is required for dine-in orders',
      });
    }

    // Validate customer details for delivery
    if (diningOption === 'delivery') {
      if (!customerDetails || !customerDetails.name || !customerDetails.phone || !customerDetails.address) {
        return res.status(400).json({
          success: false,
          message: 'Customer details are required for delivery orders',
        });
      }
    }

    // Validate payment information
    if (!paymentId || !paymentStatus || !transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Payment information is required',
      });
    }

    // Generate a unique order ID
    const orderId = `ORDER-${Date.now()}`;
    
    // In a real application, you would create an order in your database
    // For this implementation, we'll simulate order creation
    
    // Create order record (pseudocode)
    // const order = await Order.create({
    //   orderId,
    //   items,
    //   subtotal,
    //   tax,
    //   discount,
    //   total,
    //   diningOption,
    //   tableNumber,
    //   paymentMethod,
    //   customerDetails, 
    //   orderNumber,
    //   paymentId,
    //   paymentStatus,
    //   transactionId,
    //   status: 'received',
    //   createdAt: new Date(),
    // });

    // If dine-in, update table status (pseudocode)
    // if (diningOption === 'dine-in') {
    //   await Table.findOneAndUpdate(
    //     { tableNumber },
    //     { status: 'occupied', currentOrderId: orderId }
    //   );
    // }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return success response with order details
    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId,
        orderNumber,
        status: 'received',
        timestamp: new Date().toISOString(),
        estimatedReadyTime: new Date(Date.now() + 20 * 60000).toISOString(), // 20 minutes from now
      },
    });
  } catch (error :any ) {
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while creating the order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get all orders
 * @route GET /api/v1/orders
 * @access Private
 */
export const getOrders = async  (req: Request, res: Response) => {
  try {
    // In a real application, you would fetch orders from your database
    // For this implementation, we'll return an empty array
    
    return res.status(200).json({
      success: true,
      data: [],
    });
  } catch (error : any) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching orders',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Get order by ID
 * @route GET /api/v1/orders/:orderId
 * @access Private
 */
export const getOrderById = async  (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    
    // In a real application, you would fetch the order from your database
    // For this implementation, we'll return a not found error
    
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching the order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Update order status
 * @route PATCH /api/v1/orders/:orderId/status
 * @access Private
 */
export const updateOrderStatus = async  (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
      });
    }
    
    // Validate status
    const validStatuses = ['received', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      });
    }
    
    // In a real application, you would update the order in your database
    // For this implementation, we'll return a not found error
    
    return res.status(404).json({
      success: false,
      message: 'Order not found',
    });
  } catch (error : any) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while updating order status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
