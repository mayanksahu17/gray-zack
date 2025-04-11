  import express from 'express';
  import * as restaurantController from '../controller/restaurant.controller'; // Adjust import path as needed
  import { verifyJWT } from '../middleware/auth.middleware';
  import { authorizePermission } from '../middleware/authorize.middleware';
  import { AdminRole } from '../models/administrator.model';
  import { Restaurant } from '../models/restaurant.model';
  import { StaffRole } from '../models/staff.model';



  const router = express.Router();

  // Public routes
  // router.get('/', restaurantController.getAllRestaurants);
  router.get('/:id', restaurantController.getRestaurantById);
  // router.get('/:id/availability', restaurantController.checkRestaurantAvailability);
  router.get('/:id/menu', restaurantController.getRestaurantMenu);
  router.post('/:id/menu',restaurantController.addMenuCategory)
  // Protected routes - Hotel Admin only
  router.post(
    '/',
    verifyJWT,
    authorizePermission([AdminRole.HOTEL_ADMIN] ),
    restaurantController.createRestaurant
  );
 


  router.post(
    '/payments/process',
    // verifyJWT,
    restaurantController.processPayment
  );

  router.patch(
    '/:id',
    verifyJWT,
    authorizePermission([AdminRole.HOTEL_ADMIN]),
    restaurantController.updateRestaurant
  );



  // router.delete(
  //   '/:id',
  //   verifyJWT,
  //   authorizePermission([AdminRole.HOTEL_ADMIN]),
  //   restaurantController.deleteRestaurant
  // );

  // Menu Customization Routes
  router.post(
    '/:id/menu-items',
    verifyJWT,
    // authorizePermission([AdminRole.HOTEL_ADMIN]),
    // authorizePermission([StaffRole.RESTAURANT_MANAGER]),
    restaurantController.addMenuItem
  );

  router.patch(
    '/:restaurantId/menu-items/:itemId',
    // verifyJWT,
    // authorizePermission([AdminRole.HOTEL_ADMIN]),
    restaurantController.updateMenuItem
  );




  router.delete(
    '/:restaurantId/menu-items/:categoryId/:itemId',
    // verifyJWT,
    // authorizePermission([AdminRole.HOTEL_ADMIN]),
    restaurantController.deleteMenuItem
  );

  router.delete(
    '/:restaurantId/menu-items/:categoryId',
    restaurantController.deleteMenuCategory
  );
  
  // Table Management Routes
  router.post("/:id/tables",restaurantController.addRestaurantTable)
  router.get("/:id/tables",restaurantController.getRestaurantTables)
  router.patch("/:id/tables/:tableId",restaurantController.updateRestaurantTable)
  router.delete("/:id/tables/:tableId",restaurantController.deleteRestaurantTable)
  router.patch("/:id/tables/:tableId/status",restaurantController.updateTableStatus)
 


  // Room Service Routes
  // router.post(
  //   '/:id/room-service',
  //   verifyJWT,
  //   authorizePermission([AdminRole.HOTEL_ADMIN]),
  //   restaurantController.createRoomServiceOrder
  // );

  // Mobile Ordering Routes
  // router.get(
  //   '/:id/qr-code',
  //   verifyJWT,
  //   authorizePermission([AdminRole.HOTEL_ADMIN]),
  //   restaurantController.generateQRCode
  // );

  // router.post(
  //   '/:id/mobile-orders',
  //   verifyJWT,
  //   authorizePermission([AdminRole.HOTEL_ADMIN]),
  //   restaurantController.createMobileOrder
  // );

  // Order Routes
  router.post(
    '/:restaurantId/orders',
    // verifyJWT,
    restaurantController.createOrder
  );

  router.get(
    '/:restaurantId/orders',
    // verifyJWT,
    restaurantController.getRestaurantOrders
  );

  router.get(
    '/:restaurantId/orders/:orderId',
    // verifyJWT,
    restaurantController.getOrderById
  );

  router.patch(
    '/:restaurantId/orders/:orderId/status',
    // verifyJWT,
    restaurantController.updateOrderStatus
  );

  router.delete(
    '/:restaurantId/orders/:orderId',
    // verifyJWT,
    restaurantController.deleteOrder
  );

  // Payment Routes
  router.post(
    '/payments/process',
    // verifyJWT,
    restaurantController.processPayment
  );

  router.get(
    '/payments/:paymentId',
    // verifyJWT,
    restaurantController.getPaymentDetails
  );

  export default router;