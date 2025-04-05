import { Router } from 'express';
import {
    createAdministrator,
    loginAdministrator,
    updateAdministrator,
    deleteAdministrator,
    getAdministrators,
    refreshAccessToken,
    logout
} from '../../controller/posAdminController/administrator.controller';
import { verifyJWT } from '../../middleware/auth.middleware';
import { authorizePermission } from '../../middleware/authorize.middleware';
import { AdminPermission, AdminRole } from '../../models/administrator.model';

const router = Router();

// Public route
router.route("/login").post(loginAdministrator);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logout);

// Protected routes
// Only system admins can create new administrators
router.route("/initialize")
    .post(createAdministrator);

router.route("/create")
    .post(
        verifyJWT,
        authorizePermission([AdminRole.SYSTEM_ADMIN]),
        createAdministrator
    );

// Get all administrators (requires manage_users permission)
router.route("/")
    .post(
        verifyJWT,
        authorizePermission([AdminRole.SYSTEM_ADMIN], [AdminPermission.MANAGE_USERS]),
        getAdministrators
    );

// Update and delete routes (requires system_admin role)
router.route("/:id")
    .put(
        verifyJWT,
        authorizePermission([AdminRole.SYSTEM_ADMIN]),
        updateAdministrator
    )
    .delete(
        verifyJWT,
        authorizePermission([AdminRole.SYSTEM_ADMIN]),
        deleteAdministrator
    );

export default router;
