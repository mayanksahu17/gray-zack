# Hotel Room API Documentation

Base URL: `http://localhost:8000/api/v1/room`

## Table of Contents
- [Authentication](#authentication)
- [1. Create Room](#1-create-room)
- [2. Get Rooms](#2-get-rooms)
- [3. Get Room by ID](#3-get-room-by-id)
- [4. Update Room](#4-update-room)
- [5. Delete Room](#5-delete-room)
- [6. Update Room Status](#6-update-room-status)
- [7. Mark Room as Cleaned](#7-mark-room-as-cleaned)

## Authentication

Most endpoints require authentication using a JWT token.

**Headers:**
```
Authorization: Bearer {your_jwt_token}
```

## 1. Create Room

Create a new room in the system.

- **URL**: `/`
- **Method**: `POST`
- **Auth Required**: Yes
- **Content-Type**: `application/json`

### Request Body

```json
{
  "hotelId": "60d21b4667d0d8992e610c85",
  "roomNumber": "301",
  "type": "deluxe",
  "floor": 3,
  "beds": "1 King",
  "capacity": 2,
  "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker"],
  "pricePerNight": 149.99,
  "status": "available"
}
```

### Success Response

- **Code**: 201 Created
- **Content**:

```json
{
  "success": true,
  "message": "Room created successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker"],
    "pricePerNight": 149.99,
    "status": "available",
    "lastCleaned": "2025-04-03T14:30:00.000Z",
    "createdAt": "2025-04-03T14:30:00.000Z",
    "updatedAt": "2025-04-03T14:30:00.000Z"
  }
}
```

### Error Responses

- **Code**: 400 Bad Request
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room number is required"
  }
  ```

- **Code**: 409 Conflict
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room 301 already exists in this hotel"
  }
  ```

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to create room",
    "error": "Error message details"
  }
  ```

## 2. Get Rooms

Retrieve rooms with filtering and pagination.

- **URL**: `/`
- **Method**: `GET`
- **Auth Required**: No
- **Content-Type**: `application/json`

### Query Parameters

| Parameter | Type    | Required | Description                       |
|-----------|---------|----------|-----------------------------------|
| hotelId   | string  | No       | Filter by hotel ID                |
| type      | string  | No       | Filter by room type               |
| status    | string  | No       | Filter by room status             |
| floor     | number  | No       | Filter by floor                   |
| minPrice  | number  | No       | Filter by minimum price per night |
| maxPrice  | number  | No       | Filter by maximum price per night |
| capacity  | number  | No       | Filter by minimum capacity        |
| page      | number  | No       | Page number (default: 1)          |
| limit     | number  | No       | Items per page (default: 10)      |

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "count": 2,
  "totalRooms": 25,
  "totalPages": 13,
  "currentPage": 1,
  "data": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "hotelId": "60d21b4667d0d8992e610c85",
      "roomNumber": "301",
      "type": "deluxe",
      "floor": 3,
      "beds": "1 King",
      "capacity": 2,
      "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker"],
      "pricePerNight": 149.99,
      "status": "available",
      "lastCleaned": "2025-04-03T14:30:00.000Z",
      "createdAt": "2025-04-03T14:30:00.000Z",
      "updatedAt": "2025-04-03T14:30:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c91",
      "hotelId": "60d21b4667d0d8992e610c85",
      "roomNumber": "302",
      "type": "standard",
      "floor": 3,
      "beds": "2 Queen",
      "capacity": 4,
      "amenities": ["WiFi", "TV"],
      "pricePerNight": 129.99,
      "status": "occupied",
      "lastCleaned": "2025-04-02T10:15:00.000Z",
      "createdAt": "2025-04-01T09:45:00.000Z",
      "updatedAt": "2025-04-02T14:30:00.000Z"
    }
  ]
}
```

### Example Requests

1. Get all available deluxe rooms:
   ```
   GET /api/v1/room?status=available&type=deluxe
   ```

2. Get rooms on floor 3 with capacity of at least 2 people:
   ```
   GET /api/v1/room?floor=3&capacity=2
   ```

3. Get all rooms for a specific hotel with pagination:
   ```
   GET /api/v1/room?hotelId=60d21b4667d0d8992e610c85&page=2&limit=20
   ```

4. Get rooms within a price range:
   ```
   GET /api/v1/room?minPrice=100&maxPrice=200
   ```

### Error Response

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to fetch rooms",
    "error": "Error message details"
  }
  ```

## 3. Get Room by ID

Retrieve a specific room by ID.

- **URL**: `/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Content-Type**: `application/json`

### URL Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker"],
    "pricePerNight": 149.99,
    "status": "available",
    "lastCleaned": "2025-04-03T14:30:00.000Z",
    "createdAt": "2025-04-03T14:30:00.000Z",
    "updatedAt": "2025-04-03T14:30:00.000Z"
  }
}
```

### Error Responses

- **Code**: 400 Bad Request
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Invalid room ID format"
  }
  ```

- **Code**: 404 Not Found
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room not found"
  }
  ```

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to fetch room",
    "error": "Error message details"
  }
  ```

## 4. Update Room

Update room details.

- **URL**: `/:id`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Content-Type**: `application/json`

### URL Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

### Request Body

```json
{
  "pricePerNight": 159.99,
  "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron"],
  "status": "maintenance"
}
```

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Room updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron"],
    "pricePerNight": 159.99,
    "status": "maintenance",
    "lastCleaned": "2025-04-03T14:30:00.000Z",
    "createdAt": "2025-04-03T14:30:00.000Z",
    "updatedAt": "2025-04-03T15:45:00.000Z"
  }
}
```

### Error Responses

- **Code**: 400 Bad Request
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Invalid room ID format"
  }
  ```

- **Code**: 404 Not Found
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room not found"
  }
  ```

- **Code**: 409 Conflict
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room 301 already exists in this hotel"
  }
  ```

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to update room",
    "error": "Error message details"
  }
  ```

## 5. Delete Room

Delete a room from the system.

- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Content-Type**: `application/json`

### URL Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Room deleted successfully"
}
```

### Error Responses

- **Code**: 400 Bad Request
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Invalid room ID format"
  }
  ```

- **Code**: 404 Not Found
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room not found"
  }
  ```

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to delete room",
    "error": "Error message details"
  }
  ```

## 6. Update Room Status

Update only the status of a room.

- **URL**: `/:id/status`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Content-Type**: `application/json`

### URL Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

### Request Body

```json
{
  "status": "occupied"
}
```

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Room status updated successfully",
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron"],
    "pricePerNight": 159.99,
    "status": "occupied",
    "lastCleaned": "2025-04-03T14:30:00.000Z",
    "createdAt": "2025-04-03T14:30:00.000Z",
    "updatedAt": "2025-04-03T16:30:00.000Z"
  }
}
```

### Error Responses

- **Code**: 400 Bad Request
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Status is required"
  }
  ```

- **Code**: 404 Not Found
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room not found"
  }
  ```

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to update room status",
    "error": "Error message details"
  }
  ```

## 7. Mark Room as Cleaned

Mark a room as cleaned and update its status to available.

- **URL**: `/:id/clean`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **Content-Type**: `application/json`

### URL Parameters

| Parameter | Type   | Required | Description |
|-----------|--------|----------|-------------|
| id        | string | Yes      | Room ID     |

### Request Body

No request body needed.

### Success Response

- **Code**: 200 OK
- **Content**:

```json
{
  "success": true,
  "message": "Room marked as cleaned",
  "data": {
    "_id": "60d21b4667d0d8992e610c90",
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron"],
    "pricePerNight": 159.99,
    "status": "available",
    "lastCleaned": "2025-04-03T17:15:00.000Z",
    "createdAt": "2025-04-03T14:30:00.000Z",
    "updatedAt": "2025-04-03T17:15:00.000Z"
  }
}
```

### Error Responses

- **Code**: 400 Bad Request
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Invalid room ID format"
  }
  ```

- **Code**: 404 Not Found
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Room not found"
  }
  ```

- **Code**: 500 Internal Server Error
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Failed to mark room as cleaned",
    "error": "Error message details"
  }
  ```