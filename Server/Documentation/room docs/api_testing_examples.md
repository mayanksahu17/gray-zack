// This file contains examples for testing the Room API endpoints
// You can use these examples with Postman, Thunder Client, or any API testing tool

// Base URL
const baseUrl = "http://localhost:8000/api/v1/room";

// Authentication JWT token (replace with your actual token)
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// Example headers with authentication
const authHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`
};

// Example headers without authentication
const publicHeaders = {
  "Content-Type": "application/json"
};

// 1. CREATE ROOM
// POST /api/v1/room
const createRoomRequest = {
  method: "POST",
  url: baseUrl,
  headers: authHeaders,
  body: JSON.stringify({
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker"],
    "pricePerNight": 149.99,
    "status": "available"
  })
};

// Example: Create a standard room
const createStandardRoomRequest = {
  method: "POST",
  url: baseUrl,
  headers: authHeaders,
  body: JSON.stringify({
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "201",
    "type": "standard",
    "floor": 2,
    "beds": "2 Queen",
    "capacity": 4,
    "amenities": ["WiFi", "TV"],
    "pricePerNight": 119.99,
    "status": "available"
  })
};

// Example: Create a suite
const createSuiteRequest = {
  method: "POST",
  url: baseUrl,
  headers: authHeaders,
  body: JSON.stringify({
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "501",
    "type": "suite",
    "floor": 5,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Jacuzzi", "Balcony"],
    "pricePerNight": 249.99,
    "status": "available"
  })
};

// Example: Create an accessible room
const createAccessibleRoomRequest = {
  method: "POST",
  url: baseUrl,
  headers: authHeaders,
  body: JSON.stringify({
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "101",
    "type": "Accessible",
    "floor": 1,
    "beds": "2 Queen",
    "capacity": 4,
    "amenities": ["WiFi", "TV", "Wheelchair accessible bathroom", "Emergency cords"],
    "pricePerNight": 129.99,
    "status": "available"
  })
};

// 2. GET ROOMS (with various filters)
// GET /api/v1/room

// Example: Get all rooms
const getAllRoomsRequest = {
  method: "GET",
  url: baseUrl,
  headers: publicHeaders
};

// Example: Get rooms with filtering and pagination
const getFilteredRoomsRequest = {
  method: "GET",
  url: `${baseUrl}?hotelId=60d21b4667d0d8992e610c85&type=deluxe&status=available&page=1&limit=10`,
  headers: publicHeaders
};

// Example: Get rooms by floor
const getRoomsByFloorRequest = {
  method: "GET",
  url: `${baseUrl}?floor=3`,
  headers: publicHeaders
};

// Example: Get rooms by price range
const getRoomsByPriceRequest = {
  method: "GET",
  url: `${baseUrl}?minPrice=100&maxPrice=200`,
  headers: publicHeaders
};

// Example: Get rooms by capacity
const getRoomsByCapacityRequest = {
  method: "GET",
  url: `${baseUrl}?capacity=4`,
  headers: publicHeaders
};

// 3. GET ROOM BY ID
// GET /api/v1/room/:id
const getRoomByIdRequest = {
  method: "GET",
  url: `${baseUrl}/60d21b4667d0d8992e610c90`,
  headers: publicHeaders
};

// 4. UPDATE ROOM
// PATCH /api/v1/room/:id
const updateRoomRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90`,
  headers: authHeaders,
  body: JSON.stringify({
    "pricePerNight": 159.99,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron"],
    "status": "maintenance"
  })
};

// Example: Update room type and capacity
const updateRoomTypeRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90`,
  headers: authHeaders,
  body: JSON.stringify({
    "type": "suite",
    "capacity": 3,
    "pricePerNight": 199.99
  })
};

// Example: Update room number and floor
const updateRoomNumberRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90`,
  headers: authHeaders,
  body: JSON.stringify({
    "roomNumber": "401",
    "floor": 4
  })
};

// 5. DELETE ROOM
// DELETE /api/v1/room/:id
const deleteRoomRequest = {
  method: "DELETE",
  url: `${baseUrl}/60d21b4667d0d8992e610c90`,
  headers: authHeaders
};

// 6. UPDATE ROOM STATUS
// PATCH /api/v1/room/:id/status
const updateRoomStatusRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90/status`,
  headers: authHeaders,
  body: JSON.stringify({
    "status": "occupied"
  })
};

// Example: Mark room as under maintenance
const markRoomMaintenanceRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90/status`,
  headers: authHeaders,
  body: JSON.stringify({
    "status": "maintenance"
  })
};

// Example: Mark room as cleaning
const markRoomCleaningRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90/status`,
  headers: authHeaders,
  body: JSON.stringify({
    "status": "cleaning"
  })
};

// 7. MARK ROOM AS CLEANED
// PATCH /api/v1/room/:id/clean
const markRoomAsCleanedRequest = {
  method: "PATCH",
  url: `${baseUrl}/60d21b4667d0d8992e610c90/clean`,
  headers: authHeaders
};