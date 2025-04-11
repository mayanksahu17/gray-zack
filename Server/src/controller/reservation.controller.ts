import { Request, Response } from "express";
// import Booking from "../models/booking.model";
import Room from "../models/room.model";
import Booking, { BookingStatus } from "../models/booking.model";
import Guest from "../models/guest.model";
import Invoice from "../models/invoice.model";

const DEFAULT_HOTEL_ID = "67dd8f8173deaf59ece8e7f3"; // Replace with actual hotel ID or config value
const TAX_RATE = 0.125; // 12.5% tax rate
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      hotelId = DEFAULT_HOTEL_ID,
      guestId,
      roomId,
      checkIn,
      expectedCheckOut,
      adults,
      children,
      cardKey,
      addOns,
      payment,
      status
    } = req.body;

    // Create the booking
    const newBooking = await Booking.create({
      hotelId,
      guestId,
      roomId,
      checkIn,
      expectedCheckOut,
      adults,
      children,
      cardKey,
      addOns,
      payment,
      status: status || BookingStatus.BOOKED
    });

    // Update room status to "occupied" if checked in
    if (status === BookingStatus.CHECKED_IN) {
      await Room.findByIdAndUpdate(roomId, { status: "occupied" });
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: newBooking
    });
  } catch (err: any) {
    console.error("Error creating booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: err.message
    });
  }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber type pricePerNight');
      
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found"
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (err: any) {
    console.error("Error fetching booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: err.message
    });
  }
};

export const getBookingsByGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, lastName, reservationNumber } = req.query;
    
    const query: any = { hotelId: DEFAULT_HOTEL_ID };
    
    if (reservationNumber) {
      // If reservation number is provided, search by it directly
      const booking = await Booking.findById(reservationNumber)
        .populate('guestId', 'firstName lastName email phone')
        .populate('roomId', 'roomNumber type pricePerNight');
        
      if (booking) {
        res.status(200).json({
          success: true,
          data: [booking]
        });
        return;
      }
    } else {
      // Otherwise search for guest first
      let guestQuery: any = {};
      
      if (email) guestQuery.email = email;
      if (phone) guestQuery.phone = phone;
      if (lastName) guestQuery["personalInfo.lastName"] = lastName;
      
      if (Object.keys(guestQuery).length === 0) {
        res.status(400).json({
          success: false,
          message: "At least one search parameter is required"
        });
        return;
      }
      
      const guests = await Guest.find(guestQuery);
      
      if (guests.length === 0) {
        res.status(200).json({
          success: true,
          data: []
        });
        return;
      }
      
      const guestIds = guests.map(guest => guest._id);
      query.guestId = { $in: guestIds };
    }
    
    const bookings = await Booking.find(query)
      .populate('guestId', 'firstName lastName email phone')
      .populate('roomId', 'roomNumber type pricePerNight')
      .sort({ checkIn: -1 });
      
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (err: any) {
    console.error("Error fetching bookings by guest:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message
    });
  }
};




export const checkInGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      hotelId = DEFAULT_HOTEL_ID,
      guestId,
      roomId,
      checkIn,
      expectedCheckOut,
      adults,
      children,
      cardKey,
      addOns,
      payment,
      lineItems,
      totalAmount
    } = req.body;

    // Check if room is available
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found"
      });
      return;
    }
    
    if (room.status === "occupied" || room.status === "maintenance") {
      res.status(400).json({
        success: false,
        message: "Room is not available for check-in"
      });
      return;
    }

    // Create booking
    const booking = await Booking.create({
      hotelId,
      guestId,
      roomId,
      checkIn,
      expectedCheckOut,
      adults,
      children,
      cardKey,
      addOns,
      payment,
      status: BookingStatus.CHECKED_IN
    });

    // Update room status
    await Room.findByIdAndUpdate(roomId, { status: "occupied" });

    // Create invoice
    const invoice = await Invoice.create({
      bookingId: booking._id,
      guestId,
      roomId,
      lineItems,
      subtotal: totalAmount - (totalAmount * TAX_RATE),
      taxAmount: totalAmount * TAX_RATE,
      totalAmount,
      billing: {
        method: payment.method,
        paidAmount: payment.paidAmount,
        status: "partial",
        transactionId: payment.transactionId,
        paidAt: new Date()
      }
    });

    res.status(201).json({
      success: true,
      message: "Guest checked in successfully",
      data: {
        booking,
        invoice
      }
    });
  } catch (err: any) {
    console.error("Error checking in guest:", err);
    res.status(500).json({
      success: false,
      message: "Failed to check in guest",
      error: err.message
    });
  }
};

export const makePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      cardNumber, 
      expiry, 
      cvv, 
      amount, 
      currency = "USD", 
      userId 
    } = req.body;

    // Validate payment details
    if (!cardNumber || !expiry || !cvv || !amount) {
      res.status(400).json({
        success: false,
        message: "Missing required payment information"
      });
      return;
    }

    // Simple validation
    if (cardNumber.length < 13 || cardNumber.length > 19) {
      res.status(400).json({
        success: false,
        message: "Invalid card number"
      });
      return;
    }

    // In a real app, this would connect to a payment processor
    // For demo purposes, we'll simulate successful payment
    const transactionId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      transactionId,
      amount,
      currency,
      last4: cardNumber.slice(-4)
    });
  } catch (err: any) {
    console.error("Error processing payment:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process payment",
      error: err.message
    });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Prevent updating critical fields
    delete updateData._id;
    delete updateData.hotelId;
    delete updateData.guestId;
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    
    if (!updatedBooking) {
      res.status(404).json({
        success: false,
        message: "Booking not found"
      });
      return;
    }
    
    // If status changed to checked out, update room status
    if (updateData.status === BookingStatus.CHECKED_OUT) {
      await Room.findByIdAndUpdate(updatedBooking.roomId, { status: "available" });
      
      // Update booking with actual checkout date if not provided
      if (!updateData.actualCheckOut) {
        updatedBooking.actualCheckOut = new Date();
        await updatedBooking.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking
    });
  } catch (err: any) {
    console.error("Error updating booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: err.message
    });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found"
      });
      return;
    }
    
    // Only allow deletion of bookings that are not checked in
    if (booking.status === BookingStatus.CHECKED_IN) {
      res.status(400).json({
        success: false,
        message: "Cannot delete a booking that is already checked in"
      });
      return;
    }
    
    await Booking.findByIdAndDelete(id);
    
    // If the booking had a room assigned, ensure it's marked as available
    if (booking.roomId) {
      await Room.findByIdAndUpdate(booking.roomId, { status: "available" });
    }
    
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully"
    });
  } catch (err: any) {
    console.error("Error deleting booking:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: err.message
    });
  }
};

export const getAvailableRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      hotelId = DEFAULT_HOTEL_ID, 
      checkIn, 
      checkOut,
      adults,
      children,
      roomType
    } = req.query;
    
    // Basic query to get available rooms
    const query: any = { 
      hotelId: hotelId,
      status: "available" 
    };
    
    // Add room type filter if provided
    if (roomType && roomType !== "all") {
      query.type = roomType;
    }
    
    // Find all rooms that match the basic criteria
    const rooms = await Room.find(query);
    
    // If check-in and check-out dates provided, filter further
    if (checkIn && checkOut) {
      // Find bookings that overlap with the requested period
      const overlappingBookings = await Booking.find({
        roomId: { $in: rooms.map(room => room._id) },
        status: { $in: [BookingStatus.BOOKED, BookingStatus.CHECKED_IN] },
        $or: [
          // Case 1: Booking check-in is between requested check-in and check-out
          { 
            checkIn: { 
              $gte: new Date(checkIn as string), 
              $lt: new Date(checkOut as string) 
            } 
          },
          // Case 2: Booking check-out is between requested check-in and check-out
          { 
            expectedCheckOut: { 
              $gt: new Date(checkIn as string), 
              $lte: new Date(checkOut as string) 
            } 
          },
          // Case 3: Booking spans the entire requested period
          { 
            checkIn: { $lte: new Date(checkIn as string) },
            expectedCheckOut: { $gte: new Date(checkOut as string) }
          }
        ]
      });
      
      // Filter out rooms that have overlapping bookings
      const unavailableRoomIds = overlappingBookings.map(booking => 
        booking.roomId.toString()
      );
      
      const availableRooms = rooms.filter(room => 
        !unavailableRoomIds.includes(room._id.toString())
      );
      
      res.status(200).json({
        success: true,
        count: availableRooms.length,
        data: availableRooms
      });
      return;
    }
    
    // If no date filtering, return all available rooms
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (err: any) {
    console.error("Error fetching available rooms:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available rooms",
      error: err.message
    });
  }
};