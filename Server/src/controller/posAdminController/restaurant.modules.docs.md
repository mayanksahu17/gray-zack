

# Restaurant API Documentation

## Base URL
```
http://localhost:8000/api/v1/admin/hotel/restaurant
```

## Authentication
All protected routes require JWT authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Routes and Payloads

### 1. Create Restaurant
**POST** `/`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "hotelId": "65f2e8b7c261e8b7c261e8b7",
  "name": "The Golden Plate",
  "description": "A fine dining restaurant specializing in international cuisine",
  "cuisine": ["italian", "mediterranean", "french"],
  "priceRange": "$$$",
  "email": "goldenplate@example.com",
  "menuItems": [
    {
      "itemId": "item001",
      "name": "Margherita Pizza",
      "description": "Classic Italian pizza with fresh tomatoes and mozzarella",
      "price": 15.99,
      "category": "main_course",
      "available": true,
      "image": "https://example.com/pizza.jpg",
      "ingredients": ["tomatoes", "mozzarella", "basil", "olive oil"],
      "allergens": ["dairy"],
      "spicyLevel": 0,
      "vegetarian": true,
      "vegan": false,
      "glutenFree": false,
      "preparationTime": 20,
      "popular": true
    }
  ],
  "operatingHours": {
    "monday": {
      "open": "11:00",
      "close": "22:00"
    },
    "tuesday": {
      "open": "11:00",
      "close": "22:00"
    },
    "wednesday": {
      "open": "11:00",
      "close": "22:00"
    },
    "thursday": {
      "open": "11:00",
      "close": "22:00"
    },
    "friday": {
      "open": "11:00",
      "close": "23:00"
    },
    "saturday": {
      "open": "11:00",
      "close": "23:00"
    },
    "sunday": {
      "open": "12:00",
      "close": "22:00"
    }
  },
  "reservationRequired": true,
  "takeout": true,
  "delivery": true,
  "capacity": 100,
  "images": [
    "https://example.com/restaurant1.jpg",
    "https://example.com/restaurant2.jpg"
  ],
  "established": "2020-01-01T00:00:00.000Z",
  "tables": [
    {
      "tableNumber": "T1",
      "capacity": 4,
      "location": "indoor",
      "status": "available",
      "features": ["window", "booth"]
    }
  ]
}
```

### 2. Get All Restaurants
**GET** `/`

**Authorization Required:** No

**Query Parameters:**
```
cuisine: italian,chinese
priceRange: $$$
city: New York
vegetarian: true
vegan: false
glutenFree: true
page: 1
limit: 10
```

### 3. Get Restaurant by ID
**GET** `/:id`

**Authorization Required:** No

**Parameters:**
- `id`: Restaurant ID

### 4. Check Restaurant Availability
**GET** `/:id/availability`

**Authorization Required:** No

**Parameters:**
- `id`: Restaurant ID
- `date`: Optional date parameter (ISO format)

### 5. Get Restaurant Menu
**GET** `/:id/menu`

**Authorization Required:** No

**Parameters:**
- `id`: Restaurant ID

**Query Parameters:**
```
category: main_course
vegetarian: true
vegan: false
glutenFree: true
availableOnly: true
```

### 6. Update Restaurant
**PATCH** `/:id`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "name": "The Golden Plate Updated",
  "description": "Updated description",
  "priceRange": "$$$$",
  "operatingHours": {
    "monday": {
      "open": "12:00",
      "close": "23:00"
    }
  },
  "capacity": 120,
  "images": [
    "https://example.com/new-restaurant1.jpg"
  ]
}
```

### 7. Delete Restaurant
**DELETE** `/:id`

**Authorization Required:** Yes (Hotel Admin)

**Parameters:**
- `id`: Restaurant ID

### 8. Add Menu Item
**POST** `/:id/menu-items`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "itemId": "item002",
  "name": "Pasta Carbonara",
  "description": "Classic Italian pasta with eggs, cheese, and pancetta",
  "price": 18.99,
  "category": "main_course",
  "available": true,
  "image": "https://example.com/carbonara.jpg",
  "ingredients": ["pasta", "eggs", "pecorino", "pancetta", "black pepper"],
  "allergens": ["dairy", "eggs"],
  "spicyLevel": 0,
  "vegetarian": false,
  "vegan": false,
  "glutenFree": false,
  "preparationTime": 25,
  "popular": true
}
```

### 9. Update Menu Item
**PATCH** `/:id/menu-items/:itemId`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "price": 19.99,
  "available": true,
  "description": "Updated description"
}
```

### 10. Add Table
**POST** `/:id/tables`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "tableNumber": "T2",
  "capacity": 6,
  "location": "outdoor",
  "status": "available",
  "features": ["umbrella", "heater"]
}
```

### 11. Create Room Service Order
**POST** `/:id/room-service`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "roomNumber": "101",
  "items": [
    {
      "itemId": "item001",
      "quantity": 2
    }
  ],
  "specialInstructions": "Extra napkins please",
  "deliveryTime": "2024-03-15T19:00:00.000Z"
}
```

### 12. Generate QR Code
**GET** `/:id/qr-code`

**Authorization Required:** Yes (Hotel Admin)

**Parameters:**
- `id`: Restaurant ID

### 13. Create Mobile Order
**POST** `/:id/mobile-orders`

**Authorization Required:** Yes (Hotel Admin)

**Request Body:**
```json
{
  "customerName": "John Doe",
  "customerPhone": "+1-555-123-4567",
  "items": [
    {
      "itemId": "item001",
      "quantity": 1
    }
  ],
  "specialInstructions": "Extra sauce on the side",
  "pickupTime": "2024-03-15T20:00:00.000Z"
}
```

## Response Format
All API responses follow this general format:

```json
{
  "success": true,
  "message": "Operation successful message",
  "data": {
    // Response data
  }
}
```

## Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    // Array of validation errors if any
  ]
}
```

## Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Testing Notes
1. Make sure to replace the `hotelId` with a valid ID from your database
2. All timestamps should be in ISO format
3. For protected routes, ensure you have a valid JWT token
4. Test validation by sending invalid data
5. Test error handling by using invalid IDs
6. Test pagination by using different page and limit values
7. Test filtering by using different query parameters

Would you like me to provide more specific examples for any of these endpoints or additional testing scenarios?
