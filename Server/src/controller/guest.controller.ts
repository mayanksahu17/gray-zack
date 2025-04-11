import { Request, Response } from 'express';
import Guest, { IGuestDocument } from '../models/guest.model'; // adjust path if needed
import mongoose from 'mongoose';

// Create a guest if not exists
export const createGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hotelId, personalInfo } = req.body;
    console.log(hotelId , personalInfo);
    
    const existingGuest: IGuestDocument | null = await Guest.findOne({
      hotelId: new mongoose.Types.ObjectId(hotelId),
      $or: [
        { 'personalInfo.email': personalInfo.email },
        { 'personalInfo.phone': personalInfo.phone },
        { 'personalInfo.idNumber': personalInfo.idNumber }
      ]
    });

    if (existingGuest) {
      res.status(200).json({ message: 'Guest already exists', guestId: existingGuest._id });
      return;
    }

    const newGuest = new Guest(req.body);
    const savedGuest: IGuestDocument = await newGuest.save();

    res.status(201).json({ message: 'Guest created successfully', guestId: savedGuest._id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get guest by ID
export const getGuestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const guest: IGuestDocument | null = await Guest.findById(req.params.id);

    if (!guest) {
      res.status(404).json({ message: 'Guest not found' });
      return;
    }

    res.status(200).json(guest);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Get all guests for a hotel
export const getGuestsByHotel = async (req: Request, res: Response): Promise<void> => {
  try {
    const guests: IGuestDocument[] = await Guest.find({ hotelId: req.params.hotelId });

    res.status(200).json(guests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Update guest
export const updateGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedGuest: IGuestDocument | null = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedGuest) {
      res.status(404).json({ message: 'Guest not found' });
      return;
    }

    res.status(200).json({ message: 'Guest updated successfully', guest: updatedGuest });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Delete guest
export const deleteGuest = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedGuest: IGuestDocument | null = await Guest.findByIdAndDelete(req.params.id);

    if (!deletedGuest) {
      res.status(404).json({ message: 'Guest not found' });
      return;
    }

    res.status(200).json({ message: 'Guest deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Search guest by email, phone, or ID number
export const searchGuests = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, phone, idNumber } = req.query;

    const searchConditions = [];

    if (email) searchConditions.push({ 'personalInfo.email': email });
    if (phone) searchConditions.push({ 'personalInfo.phone': phone });
    if (idNumber) searchConditions.push({ 'personalInfo.idNumber': idNumber });

    if (searchConditions.length === 0) {
      res.status(400).json({
        message: 'Please provide at least one query parameter: email, phone, or idNumber.'
      });
      return;
    }

    const guests: IGuestDocument[] = await Guest.find({ $or: searchConditions });

    res.status(200).json(guests);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
