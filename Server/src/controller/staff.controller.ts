import { Request, Response } from 'express';
import Staff, { IStaffDocument } from '../models/staff.model';
import { ApiError } from '../utills/ApiError';
import { asyncHandler } from '../utills/asyncHandler';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const generateTokens = async (userId: string) => {
  try {
    const staff = await Staff.findById(userId);
    if (!staff) {
      throw new ApiError(404, 'Staff member not found');
    }

    const accessToken = staff.generateAccessToken();
    const refreshToken = staff.generateRefreshToken();

    staff.refreshToken = refreshToken;
    staff.accessToken = accessToken;
    await staff.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};



// Staff login
export const loginStaff = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const staff = await Staff.findOne({ email: email.toLowerCase() }).select('+password');
  if (!staff) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (staff.status === 'inactive') {
    throw new ApiError(403, "Account is inactive");
  }
  console.log(password);
  
  const isPasswordValid = await staff.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateTokens(staff._id);

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json({
    success: true,
    data: {
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      hotelId: staff.hotelId
    }
  });
});

// Get staff by hotel
export const getStaffByHotel = asyncHandler(async (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const { page = 1, limit = 10, role, status } = req.query;

  if (!mongoose.Types.ObjectId.isValid(hotelId)) {
    throw new ApiError(400, "Invalid hotel ID format");
  }

  const query: any = { hotelId };
  if (role) query.role = role;
  if (status) query.status = status;

  const staff = await Staff.find(query)
    .select('-password -refreshToken')
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Staff.countDocuments(query);

  return res.status(200).json({
    success: true,
    data: staff,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// Update staff member
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone, role, permissions, status } = req.body;
  const updatedBy = (req.user as IStaffDocument)._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid staff ID format");
  }

  const staff = await Staff.findById(id);
  if (!staff) {
    throw new ApiError(404, "Staff member not found");
  }

  // Ensure staff member belongs to the same hotel as the updater
  if (staff.hotelId.toString() !== (req.user as IStaffDocument).hotelId.toString()) {
    throw new ApiError(403, "Unauthorized to update staff from different hotel");
  }

  // Update fields
  if (name) staff.name = name;
  if (phone) staff.phone = phone;
  if (role) staff.role = role;
  if (permissions) staff.permissions = permissions;
  if (status) staff.status = status;

  await staff.save();

  return res.status(200).json({
    success: true,
    data: staff
  });
});

// Delete staff member
export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid staff ID format");
  }

  const staff = await Staff.findById(id);
  if (!staff) {
    throw new ApiError(404, "Staff member not found");
  }

  // Ensure staff member belongs to the same hotel as the deleter
  if (staff.hotelId.toString() !== (req.user as IStaffDocument).hotelId.toString()) {
    throw new ApiError(403, "Unauthorized to delete staff from different hotel");
  }

  await staff.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Staff member deleted successfully"
  });
});

// Refresh token
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret'
    ) as { id: string };

    const staff = await Staff.findById(decodedToken.id);
    if (!staff || staff.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateTokens(staff._id);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      accessToken
    });
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

// Logout staff
export const logoutStaff = asyncHandler(async (req: Request, res: Response) => {
  const staff = await Staff.findById((req.user as IStaffDocument)._id);
  if (!staff) {
    throw new ApiError(401, "Unauthorized request");
  }

  staff.refreshToken = "";
  await staff.save({ validateBeforeSave: false });

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});
