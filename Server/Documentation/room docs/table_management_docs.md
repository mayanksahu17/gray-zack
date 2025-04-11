# Table Management API Documentation

## Base URL
```
http://localhost:8000/api/restaurants
```

## Authentication
All endpoints require JWT authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Table Status Values
- `available`: Table is available for seating
- `occupied`: Table is currently in use
- `reserved`: Table is reserved for future use
- `maintenance`: Table is under maintenance

## Table Location Values
- `indoor`: Indoor seating
- `outdoor`: Outdoor seating
- `bar`: Bar area seating

## Endpoints

### 1. Get All Tables
**GET** `/api/restaurants/:restaurantId/tables`

Retrieves all tables for a specific restaurant.

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "_id": "table123",
            "tableNumber": "T1",
            "capacity": 4,
            "location": "indoor",
            "status": "available",
            "features": ["window view", "power outlet"],
            "currentOrder": null
        }
    ]
}
```

### 2. Add New Table
**POST** `/api/restaurants/:restaurantId/tables`

Adds a new table to the restaurant.

**Request Body:**
```json
{
    "tableNumber": "T5",
    "capacity": 6,
    "location": "outdoor",
    "status": "available",
    "features": ["rooftop", "heater"]
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "table456",
        "tableNumber": "T5",
        "capacity": 6,
        "location": "outdoor",
        "status": "available",
        "features": ["rooftop", "heater"],
        "currentOrder": null
    },
    "message": "Table added successfully"
}
```

### 3. Update Table
**PATCH** `/api/restaurants/:restaurantId/tables/:tableId`

Updates an existing table's information.

**Request Body:**
```json
{
    "capacity": 8,
    "location": "indoor",
    "features": ["window view", "power outlet", "wheelchair accessible"]
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "table123",
        "tableNumber": "T1",
        "capacity": 8,
        "location": "indoor",
        "status": "available",
        "features": ["window view", "power outlet", "wheelchair accessible"],
        "currentOrder": null
    },
    "message": "Table updated successfully"
}
```

### 4. Update Table Status
**PATCH** `/api/restaurants/:restaurantId/tables/:tableId/status`

Updates a table's status.

**Request Body:**
```json
{
    "status": "occupied",
    "orderId": "order123" // Optional, required when status is "occupied"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "_id": "table123",
        "tableNumber": "T1",
        "capacity": 4,
        "location": "indoor",
        "status": "occupied",
        "features": ["window view", "power outlet"],
        "currentOrder": "order123"
    },
    "message": "Table status updated successfully"
}
```

### 5. Delete Table
**DELETE** `/api/restaurants/:restaurantId/tables/:tableId`

Deletes a table from the restaurant.

**Response:**
```json
{
    "success": true,
    "message": "Table deleted successfully"
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
- 400: Bad Request (invalid input data)
- 401: Unauthorized (missing or invalid token)
- 404: Not Found (table or restaurant not found)
- 409: Conflict (table number already exists)
- 500: Internal Server Error

## Testing Tips

1. Start by getting all tables to see existing data
2. Test adding a new table with different locations and features
3. Try updating a table's capacity and features
4. Test status changes (available → occupied → available)
5. Test deleting a table
6. Verify that occupied tables cannot be deleted
7. Check that table numbers must be unique

## Example Test Flow

1. Get all tables:
```bash
GET /api/restaurants/restaurant123/tables
```

2. Add a new table:
```bash
POST /api/restaurants/restaurant123/tables
{
    "tableNumber": "T10",
    "capacity": 4,
    "location": "indoor",
    "status": "available",
    "features": ["window view"]
}
```

3. Update table status to occupied:
```bash
PATCH /api/restaurants/restaurant123/tables/table123/status
{
    "status": "occupied",
    "orderId": "order123"
}
```

4. Update table status back to available:
```bash
PATCH /api/restaurants/restaurant123/tables/table123/status
{
    "status": "available"
}
```

5. Update table details:
```bash
PATCH /api/restaurants/restaurant123/tables/table123
{
    "capacity": 6,
    "features": ["window view", "power outlet"]
}
```

6. Delete table:
```bash
DELETE /api/restaurants/restaurant123/tables/table123
```

## Postman Collection

You can import the following collection into Postman:

```json
{
  "info": {
    "name": "Restaurant Table Management",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Tables",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/restaurants/{{restaurantId}}/tables",
          "host": ["{{baseUrl}}"],
          "path": ["api", "restaurants", "{{restaurantId}}", "tables"]
        }
      }
    },
    {
      "name": "Add New Table",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"tableNumber\": \"T5\",\n    \"capacity\": 6,\n    \"location\": \"outdoor\",\n    \"status\": \"available\",\n    \"features\": [\"rooftop\", \"heater\"]\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/restaurants/{{restaurantId}}/tables",
          "host": ["{{baseUrl}}"],
          "path": ["api", "restaurants", "{{restaurantId}}", "tables"]
        }
      }
    },
    {
      "name": "Update Table",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"capacity\": 8,\n    \"location\": \"indoor\",\n    \"features\": [\"window view\", \"power outlet\", \"wheelchair accessible\"]\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/restaurants/{{restaurantId}}/tables/{{tableId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "restaurants", "{{restaurantId}}", "tables", "{{tableId}}"]
        }
      }
    },
    {
      "name": "Update Table Status",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"status\": \"occupied\",\n    \"orderId\": \"order123\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/restaurants/{{restaurantId}}/tables/{{tableId}}/status",
          "host": ["{{baseUrl}}"],
          "path": ["api", "restaurants", "{{restaurantId}}", "tables", "{{tableId}}", "status"]
        }
      }
    },
    {
      "name": "Delete Table",
      "request": {
        "method": "DELETE",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/restaurants/{{restaurantId}}/tables/{{tableId}}",
          "host": ["{{baseUrl}}"],
          "path": ["api", "restaurants", "{{restaurantId}}", "tables", "{{tableId}}"]
        }
      }
    }
  ]
}
```

## Environment Variables

Create a Postman environment with the following variables:
- `baseUrl`: http://localhost:8000
- `restaurantId`: Your restaurant's ID
- `tableId`: Table ID for testing
- `token`: Your JWT token

Would you like me to provide more specific examples or explain any part in more detail? 