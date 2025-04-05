import Room from '../models/room.model'
import { Request, Response } from 'express'
import { IRoomDocument } from '../models/room.model';
import mongoose from 'mongoose';
import { createHotelRooms } from '../utills/seedrooms';
import  {ObjectId} from 'mongodb'
/**
 * Create a new room
 * @route POST /api/v1/rooms
 * @access Public
 */
export const createRoom = async (req: Request, res: Response) => {
  try {
    const {
      hotelId,
      roomNumber,
      type,
      floor,
      beds,
      capacity,
      amenities,
      pricePerNight,
      status,
      lastCleaned
    }: IRoomDocument = req.body;

    // Check if room with same number already exists in the hotel
    const existingRoom = await Room.findOne({ hotelId, roomNumber });
    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: `Room ${roomNumber} already exists in this hotel`
      });
    }

    // Create new room
    const room = await Room.create({
      hotelId,
      roomNumber,
      type,
      floor,
      beds,
      capacity,
      amenities,
      pricePerNight,
      status,
      lastCleaned: lastCleaned || new Date()
    });

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err: any) => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to create room",
      error: error.message
    });
  }
};

/**
 * Get rooms with pagination and filters
 * @route GET /api/v1/rooms
 * @access Public
 */
export const getRooms = async (req: Request, res: Response) => {
  try {
    const {
      hotelId,
      type,
      status,
      floor,
      minPrice,
      maxPrice,
      capacity,
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const queryObject: any = {};

    // Add filters if provided
    if (hotelId) queryObject.hotelId = new mongoose.Types.ObjectId(hotelId as string);
    if (type) queryObject.type = type;
    if (status) queryObject.status = status;
    if (floor) queryObject.floor = Number(floor);
    if (capacity) queryObject.capacity = { $gte: Number(capacity) };
    
    // Price range filter
    if (minPrice || maxPrice) {
      queryObject.pricePerNight = {};
      if (minPrice) queryObject.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) queryObject.pricePerNight.$lte = Number(maxPrice);
    }

    // Calculate pagination values
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const rooms = await Room.find(queryObject)
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    // Get total count for pagination info
    const totalRooms = await Room.countDocuments(queryObject);
    const totalPages = Math.ceil(totalRooms / limitNum);

    res.status(200).json({
      success: true,
      count: rooms.length,
      totalRooms,
      totalPages,
      currentPage: pageNum,
      data: rooms
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch rooms",
      error: error.message
    });
  }
};

/**
 * Get a single room by ID
 * @route GET /api/v1/rooms/:id
 * @access Public
 */
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format"
      });
    }

    const room = await Room.findById(id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch room",
      error: error.message
    });
  }
};

/**
 * Update a room
 * @route PATCH /api/v1/rooms/:id
 * @access Public
 */
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format"
      });
    }

    // If updating room number, check for duplicates
    if (updates.roomNumber && updates.hotelId) {
      const existingRoom = await Room.findOne({
        hotelId: updates.hotelId,
        roomNumber: updates.roomNumber,
        _id: { $ne: id }
      });

      if (existingRoom) {
        return res.status(409).json({
          success: false,
          message: `Room ${updates.roomNumber} already exists in this hotel`
        });
      }
    }

    // Find and update room
    const room = await Room.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Room updated successfully",
      data: room
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map((err: any) => err.message).join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Failed to update room",
      error: error.message
    });
  }
};

/**
 * Delete a room
 * @route DELETE /api/v1/rooms/:id
 * @access Public
 */
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format"
      });
    }

    const room = await Room.findByIdAndDelete(id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Room deleted successfully"
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete room",
      error: error.message
    });
  }
};

/**
 * Update room status
 * @route PATCH /api/v1/rooms/:id/status
 * @access Public
 */
export const updateRoomStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false, 
        message: "Invalid room ID format"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Room status updated successfully",
      data: room
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update room status",
      error: error.message
    });
  }
};

/**
 * Mark room as cleaned
 * @route PATCH /api/v1/rooms/:id/clean
 * @access Public
 */
export const markRoomAsCleaned = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format"
      });
    }

    const room = await Room.findByIdAndUpdate(
      id,
      { 
        $set: { 
          lastCleaned: new Date(),
          status: 'available' // Assuming room becomes available after cleaning
        }
      },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Room marked as cleaned",
      data: room
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to mark room as cleaned",
      error: error.message
    });
  }
};




/**
 * Seed multiple rooms for a specific hotel
 * @param req Request object containing hotelId and count
 * @param res Response object
 */
export const seedHotelRooms = async (req: Request, res: Response) => {
  try {
    const { hotelId, count } = req.body;
    
    if (!hotelId) {
      return res.status(400).json({
        success: false,
        message: 'Hotel ID is required'
      });
    }
    
    // Create rooms for this specific hotel
    const hotelObjectId = ObjectId.createFromHexString(hotelId);
    const roomsToCreate = createHotelRooms(hotelObjectId, parseInt(count as string));
    
    // Insert rooms
    const results = await Promise.all(
      roomsToCreate.map(async (roomData) => {
        try {
          // Check if room already exists
          const existingRoom = await Room.findOne({ 
            hotelId: roomData.hotelId,
            roomNumber: roomData.roomNumber
          });
          
          if (existingRoom) {
            return {
              success: false,
              roomNumber: roomData.roomNumber,
              message: 'Room already exists'
            };
          }
          
          // Create new room
          const room = await Room.create(roomData);
          return {
            success: true,
            roomNumber: room.roomNumber,
            id: room._id
          };
        } catch (error: any) {
          return {
            success: false,
            roomNumber: roomData.roomNumber,
            error: error.message
          };
        }
      })
    );
    
    // Count successes and failures
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    return res.status(200).json({
      success: true,
      message: `Seeded ${successful} rooms for hotel ${hotelId} (${failed} failed)`,
      results
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed hotel rooms',
      error: error.message
    });
  }
};