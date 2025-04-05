import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utills/ApiError';
import { AdminRole, AdminPermission } from '../models/administrator.model';
import { IStaffDocument } from '../models/staff.model';

interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        role: AdminRole;
        permissions: AdminPermission[];
    };
}

export const authorizePermission = (
    allowedRoles: AdminRole[] = [],
    requiredPermissions: AdminPermission[] = []
) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const user = req.user;

            // Check if user exists in request (should be set by verifyJWT)
            if (!user) {
                throw new ApiError(401, "Unauthorized - Please login");
            }

            // Check roles if specified
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                throw new ApiError(403, "You don't have the required role to perform this action");
            }

            // Check permissions if specified
            if (requiredPermissions.length > 0) {
                const hasRequiredPermission = requiredPermissions.some(permission => 
                    user.permissions?.includes(permission)
                );
                
                if (!hasRequiredPermission) {
                    throw new ApiError(403, "You don't have the required permissions");
                }
            }

            // If system admin, bypass all other permission checks
            if (user.role === AdminRole.SYSTEM_ADMIN) {
                return next();
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};

// Optional: Helper function for common authorization patterns
export const authorizeSystemAdmin = authorizePermission([AdminRole.SYSTEM_ADMIN]);
export const authorizeSupportStaff = authorizePermission([AdminRole.HOTEL_ADMIN]);

export const authorizeStaff = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user as IStaffDocument;
            
            if (!user) {
                throw new ApiError(401, "Unauthorized access");
            }

            if (!allowedRoles.includes(user.role)) {
                throw new ApiError(403, "You don't have permission to perform this action");
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
