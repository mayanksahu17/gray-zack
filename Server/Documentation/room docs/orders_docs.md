# Restaurant Orders and Payments API Documentation

## Base URL
```
http://localhost:3000/api/restaurants
```

## Authentication
All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Order Status Values
- `PENDING`: Order just created
- `PREPARING`: Order is being prepared
- `READY`: Order is ready for pickup/delivery
- `COMPLETED`: Order has been completed
- `CANCELLED`: Order has been cancelled

## Order Types
- `DINE_IN`: For customers dining in the restaurant
- `TAKEOUT`: For customers picking up their order
- `DELIVERY`: For orders being delivered to customers

## Payment Methods
- `CASH`: Cash payment
- `CREDIT_CARD`: Credit card payment
- `DEBIT_CARD`: Debit card payment
- `MOBILE_PAYMENT`: Mobile payment (e.g., Apple Pay, Google Pay)
- `ONLINE`: Online payment
- `GIFT_CARD`: Gift card payment

## Payment Status Values
- `PENDING`: Payment is pending
- `PAID`: Payment has been completed
- `REFUNDED`: Payment has been refunded
- `FAILED`: Payment has failed

## Endpoints

### 1. Create Order
**POST** `/api/restaurants/:restaurantId/orders`

Creates a new order for a restaurant.

**Request Body:**
```json
{
    "customer": {
        "name": "John Doe",
        "phone": "+1234567890",
        "email": "john@example.com",
        "address": "123 Main St"
    },
    "items": [
        {
            "itemId": "item123",
            "name": "Margherita Pizza",
            "price": 12.99,
            "quantity": 2,
            "notes": "Extra cheese",
            "modifiers": ["extra cheese", "no olives"],
            "subtotal": 25.98
        },
        {
            "itemId": "item456",
            "name": "Caesar Salad",
            "price": 8.99,
            "quantity": 1,
            "notes": "No croutons",
            "modifiers": ["no croutons"],
            "subtotal": 8.99
        }
    ],
    "tableNumber": "T1",
    "type": "DINE_IN",
    "paymentMethod": "CREDIT_CARD",
    "specialInstructions": "Please bring extra napkins"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "restaurantId": "restaurant123",
        "orderNumber": "ORD-20240315-0001",
        "customer": {
            "name": "John Doe",
            "phone": "+1234567890",
            "email": "john@example.com",
            "address": "123 Main St"
        },
        "items": [...],
        "tableNumber": "T1",
        "status": "PENDING",
        "type": "DINE_IN",
        "subtotal": 34.97,
        "tax": 3.50,
        "total": 38.47,
        "payment": {
            "method": "CREDIT_CARD",
            "status": "PENDING",
            "amount": 38.47,
            "tax": 3.50,
            "tip": 0
        },
        "specialInstructions": "Please bring extra napkins",
        "orderDate": "2024-03-15T12:00:00.000Z",
        "estimatedReadyTime": "2024-03-15T12:30:00.000Z"
    }
}
```

### 2. Get Restaurant Orders
**GET** `/api/restaurants/:restaurantId/orders`

Retrieves all orders for a specific restaurant. Optional query parameters:
- `status`: Filter by order status (PENDING, PREPARING, READY, COMPLETED, CANCELLED)
- `type`: Filter by order type (DINE_IN, TAKEOUT, DELIVERY)

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "orderNumber": "ORD-20240315-0001",
            "customer": {
                "name": "John Doe",
                "phone": "+1234567890"
            },
            "status": "PENDING",
            "type": "DINE_IN",
            "total": 38.47,
            "orderDate": "2024-03-15T12:00:00.000Z"
        }
    ]
}
```

### 3. Get Order by ID
**GET** `/api/restaurants/:restaurantId/orders/:orderId`

Retrieves a specific order by its ID.

**Response:**
```json
{
    "success": true,
    "data": {
        "orderNumber": "ORD-20240315-0001",
        "customer": {
            "name": "John Doe",
            "phone": "+1234567890",
            "email": "john@example.com"
        },
        "items": [...],
        "status": "PENDING",
        "type": "DINE_IN",
        "total": 38.47,
        "payment": {
            "method": "CREDIT_CARD",
            "status": "PENDING",
            "amount": 38.47
        },
        "orderDate": "2024-03-15T12:00:00.000Z"
    }
}
```

### 4. Update Order Status
**PATCH** `/api/restaurants/:restaurantId/orders/:orderId/status`

Updates the status of an order and optionally updates payment information.

**Request Body:**
```json
{
    "status": "PREPARING",
    "paymentDetails": {
        "status": "PAID",
        "transactionId": "txn_123456789",
        "cardDetails": {
            "last4": "4242",
            "brand": "visa"
        }
    }
}
```

**Response:**
```json
{
    "success": true,
    "message": "Order status updated successfully",
    "data": {
        "orderNumber": "ORD-20240315-0001",
        "status": "PREPARING",
        "payment": {
            "status": "PAID",
            "transactionId": "txn_123456789",
            "paymentDate": "2024-03-15T12:05:00.000Z"
        }
    }
}
```

### 5. Process Payment
**POST** `/api/restaurants/payments/process`

Processes a payment for an order.

**Request Body:**
```json
{
    "orderId": "order123",
    "amount": 38.47,
    "currency": "USD",
    "paymentMethod": "CREDIT_CARD",
    "cardDetails": {
        "number": "4242424242424242",
        "expiryDate": "12/25",
        "cvv": "123"
    }
}
```

**Response:**
```json
{
    "success": true,
    "message": "Payment processed successfully",
    "data": {
        "paymentId": "pay_123456789",
        "transactionId": "txn_123456789",
        "amount": 38.47,
        "currency": "USD",
        "status": "PAID",
        "timestamp": "2024-03-15T12:05:00.000Z"
    }
}
```

### 6. Get Payment Details
**GET** `/api/restaurants/payments/:paymentId`

Retrieves payment details for a specific payment.

**Response:**
```json
{
    "success": true,
    "data": {
        "payment": {
            "method": "CREDIT_CARD",
            "status": "PAID",
            "amount": 38.47,
            "tax": 3.50,
            "tip": 0,
            "transactionId": "txn_123456789",
            "paymentDate": "2024-03-15T12:05:00.000Z",
            "cardDetails": {
                "last4": "4242",
                "brand": "visa"
            }
        },
        "orderId": "order123",
        "orderNumber": "ORD-20240315-0001",
        "status": "PREPARING"
    }
}
```

### 7. Delete Order
**DELETE** `/api/restaurants/:restaurantId/orders/:orderId`

Deletes a specific order.

**Response:**
```json
{
    "success": true,
    "message": "Order deleted successfully"
}
```

## Error Responses

All endpoints may return the following error responses:

```json
{
    "success": false,
    "message": "Error message here",
    "error": "Detailed error message (in development mode)"
}
```

Common HTTP status codes:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Testing Tips

1. Create a new order first to get an order ID
2. Use the order ID to test payment processing
3. Test different order status transitions
4. Test with different payment methods
5. Include error cases (invalid IDs, missing fields, etc.)
6. Test payment status updates with order status changes
7. Verify that table status is updated correctly for dine-in orders

## Example Test Flow

1. Create a new order:
```bash
POST /api/restaurants/restaurant123/orders
```

2. Process payment for the order:
```bash
POST /api/restaurants/payments/process
```

3. Update order status to preparing:
```bash
PATCH /api/restaurants/restaurant123/orders/order123/status
```

4. Update order status to ready:
```bash
PATCH /api/restaurants/restaurant123/orders/order123/status
```

5. Update order status to completed:
```bash
PATCH /api/restaurants/restaurant123/orders/order123/status
```

6. Verify payment details:
```bash
GET /api/restaurants/payments/payment123
```

Would you like me to provide more specific examples or explain any part in more detail?
