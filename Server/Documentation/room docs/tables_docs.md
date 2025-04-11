I'll help you create the routes and provide API documentation for testing in Postman. I see that the routes are already defined in `restaurant.route.ts`, but I'll provide a complete API documentation with payloads.

Here's the complete API documentation for table management:

### 1. Get All Tables
**Route:** `GET /api/v1/admin/hotel/restaurant/:id/tables`
**Description:** Get all tables for a specific restaurant

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "tableNumber": "T1",
            "capacity": 4,
            "location": "indoor",
            "status": "available",
            "features": ["window", "power-outlet"],
            "currentOrder": null
        }
    ]
}
```

### 2. Add New Table
**Route:** `POST /api/v1/admin/hotel/restaurant/:id/tables`
**Description:** Add a new table to the restaurant

**Request Body:**
```json
{
    "tableNumber": "T2",
    "capacity": 6,
    "location": "outdoor",
    "features": ["umbrella", "heater"]
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "tableNumber": "T2",
        "capacity": 6,
        "location": "outdoor",
        "status": "available",
        "features": ["umbrella", "heater"],
        "currentOrder": null
    },
    "message": "Table added successfully"
}
```

### 3. Update Table
**Route:** `PATCH /api/v1/admin/hotel/restaurant/:id/tables/:tableId`
**Description:** Update an existing table's information

**Request Body:**
```json
{
    "capacity": 8,
    "location": "indoor",
    "features": ["window", "power-outlet", "tv"]
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "tableNumber": "T2",
        "capacity": 8,
        "location": "indoor",
        "status": "available",
        "features": ["window", "power-outlet", "tv"],
        "currentOrder": null
    },
    "message": "Table updated successfully"
}
```

### 4. Delete Table
**Route:** `DELETE /api/v1/admin/hotel/restaurant/:id/tables/:tableId`
**Description:** Delete a table from the restaurant

**Response:**
```json
{
    "success": true,
    "message": "Table deleted successfully"
}
```

### 5. Update Table Status
**Route:** `PATCH /api/v1/admin/hotel/restaurant/:id/tables/:tableId/status`
**Description:** Update a table's status and optionally associate it with an order

**Request Body:**
```json
{
    "status": "occupied",
    "orderId": "65f1a2b3c4d5e6f7g8h9i0j1"  // Optional
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "tableNumber": "T1",
        "capacity": 4,
        "location": "indoor",
        "status": "occupied",
        "features": ["window", "power-outlet"],
        "currentOrder": "65f1a2b3c4d5e6f7g8h9i0j1"
    },
    "message": "Table status updated to occupied"
}
```

### Postman Collection Setup

1. Create a new collection named "Restaurant Table Management"
2. Create a new environment with these variables:
   ```
   base_url: http://localhost:3000/api/v1/admin/hotel/restaurant
   restaurant_id: your_restaurant_id
   ```

3. Create these requests:

#### Get All Tables
```
GET {{base_url}}/{{restaurant_id}}/tables
```

#### Add New Table
```
POST {{base_url}}/{{restaurant_id}}/tables
Content-Type: application/json

{
    "tableNumber": "T2",
    "capacity": 6,
    "location": "outdoor",
    "features": ["umbrella", "heater"]
}
```

#### Update Table
```
PATCH {{base_url}}/{{restaurant_id}}/tables/T2
Content-Type: application/json

{
    "capacity": 8,
    "location": "indoor",
    "features": ["window", "power-outlet", "tv"]
}
```

#### Delete Table
```
DELETE {{base_url}}/{{restaurant_id}}/tables/T2
```

#### Update Table Status
```
PATCH {{base_url}}/{{restaurant_id}}/tables/T1/status
Content-Type: application/json

{
    "status": "occupied",
    "orderId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

### Error Responses

All endpoints may return these common error responses:

1. Invalid Restaurant ID:
```json
{
    "success": false,
    "message": "Invalid restaurant ID format"
}
```

2. Restaurant Not Found:
```json
{
    "success": false,
    "message": "Restaurant not found"
}
```

3. Table Not Found:
```json
{
    "success": false,
    "message": "Table with number T1 not found"
}
```

4. Invalid Table Status:
```json
{
    "success": false,
    "message": "Invalid table status"
}
```

5. Server Error:
```json
{
    "success": false,
    "message": "Server error",
    "error": "Error message details"
}
```

### Notes for Testing:

1. Replace `your_restaurant_id` with an actual restaurant ID from your database
2. Table numbers should be unique within a restaurant
3. Valid table locations are: "indoor", "outdoor", "bar"
4. Valid table statuses are: "available", "occupied", "reserved", "maintenance"
5. When updating table status to "occupied", you can optionally provide an orderId
6. You cannot delete a table that is currently occupied

Would you like me to provide any additional details or clarification about any of these endpoints?
