import { Request, Response } from 'express';
import { Administrator, AdminRole, AdminStatus, AdminPermission } from '../../models/administrator.model';
import jwt from 'jsonwebtoken';
import { ApiError } from '../../utills/ApiError';
import { asyncHandler } from '../../utills/asyncHandler';
import { Types } from 'mongoose';
// Example payload for reference:
/*
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "phone": "+1-555-987-6543",
  "role": "system_admin",
  "permissions": ["create_hotel", "manage_users", "system_settings"],
  "password": "SecurePass123!"
}
*/

const generateAccessTokenandRefreshToken = async (userId: string) => {
  try {
    const user = await Administrator.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token");
  }
};

export const createAdministrator = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, role, permissions, password } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !role || !password) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // Validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new ApiError(400, "Password must contain at least 8 characters, including uppercase, lowercase, number and special character");
  }

  // Check if admin already exists
  const existingAdmin = await Administrator.findByEmail(email);
  if (existingAdmin) {
    throw new ApiError(409, "Administrator with this email already exists");
  }

  // Validate role
  if (!Object.values(AdminRole).includes(role)) {
    throw new ApiError(400, "Invalid role specified");
  }

  // Validate permissions
  if (permissions) {
    const invalidPermissions = permissions.filter((p : AdminPermission) => !Object.values(AdminPermission).includes(p));
    if (invalidPermissions.length > 0) {
      throw new ApiError(400, `Invalid permissions: ${invalidPermissions.join(', ')}`);
    }
  }

  const administrator = await Administrator.create({
    name,
    email,
    phone,
    role,
    permissions: permissions || [],
    password,
    status: AdminStatus.ACTIVE
  });

  // Remove sensitive data from response
  const adminResponse = administrator.toJSON();
  return res.status(201).json({
    success: true,
    data: adminResponse
  });
});

export const loginAdministrator = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const administrator = await Administrator.findByEmail(email);
  if (!administrator) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!administrator.isActive()) {
    throw new ApiError(403, "Account is inactive");
  }

  const isPasswordValid = await administrator.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(administrator._id);

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return res.status(200).json({
    success: true,
    data: {
      _id: administrator._id,
      email: administrator.email,
      name: administrator.name,
      role: administrator.role,
      accessToken
    }
  });
});

export const updateAdministrator = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone, role, permissions, status } = req.body;
  
  const administrator = await Administrator.findById(new Types.ObjectId(id));
  if (!administrator) {
    throw new ApiError(404, "Administrator not found");
  }

  // Prevent role update if it's the last system admin
  if (role && role !== administrator.role && administrator.role === AdminRole.SYSTEM_ADMIN) {
    const systemAdminCount = await Administrator.countDocuments({ role: AdminRole.SYSTEM_ADMIN });
    if (systemAdminCount === 1) {
      throw new ApiError(400, "Cannot change role of the last system administrator");
    }
  }

  // Update fields
  if (name) administrator.name = name;
  if (phone) administrator.phone = phone;
  if (role) administrator.role = role;
  if (permissions) administrator.permissions = permissions;
  if (status) administrator.status = status;

  await administrator.save();

  return res.status(200).json({
    success: true,
    data: administrator
  });
});

export const deleteAdministrator = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const administrator = await Administrator.findById(id);
  if (!administrator) {
    throw new ApiError(404, "Administrator not found");
  }

  // Prevent deletion of last system admin
  if (administrator.role === AdminRole.SYSTEM_ADMIN) {
    const systemAdminCount = await Administrator.countDocuments({ role: AdminRole.SYSTEM_ADMIN });
    if (systemAdminCount === 1) {
      throw new ApiError(400, "Cannot delete the last system administrator");
    }
  }

  await administrator.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Administrator deleted successfully"
  });
});

export const getAdministrators = asyncHandler(async (req: Request, res: Response) => {
  const { role, status, page = 1, limit = 10 } = req.query;

  const query: any = {};
  if (role) query.role = role;
  if (status) query.status = status;

  const administrators = await Administrator.find(query)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Administrator.countDocuments(query);

  return res.status(200).json({
    success: true,
    data: administrators,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    }
  });
});

// Add refresh token endpoint
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET || 'fallback-refresh-secret'
    ) as { id: string };

    const administrator = await Administrator.findById(decodedToken.id);
    if (!administrator) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== administrator.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const { accessToken, refreshToken } = await generateAccessTokenandRefreshToken(administrator._id);

    // Set new cookies
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

// Add logout endpoint
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const administrator = await Administrator.findById(req.user?._id);
  if (!administrator) {
    throw new ApiError(401, "Unauthorized request");
  }

  administrator.refreshToken = "";
  await administrator.save({ validateBeforeSave: false });

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
});
