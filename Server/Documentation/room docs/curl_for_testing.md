#!/bin/bash
# Hotel Room API cURL Testing Examples

# Base URL
BASE_URL="http://localhost:8000/api/v1/room"

# Your JWT token (replace with actual token)
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 1. CREATE ROOM
echo "===== Creating a new room ====="
curl -X POST "${BASE_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "301",
    "type": "deluxe",
    "floor": 3,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker"],
    "pricePerNight": 149.99,
    "status": "available"
  }'

echo -e "\n\n===== Creating a standard room ====="
curl -X POST "${BASE_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "201",
    "type": "standard",
    "floor": 2,
    "beds": "2 Queen",
    "capacity": 4,
    "amenities": ["WiFi", "TV"],
    "pricePerNight": 119.99,
    "status": "available"
  }'

echo -e "\n\n===== Creating a suite ====="
curl -X POST "${BASE_URL}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "hotelId": "60d21b4667d0d8992e610c85",
    "roomNumber": "501",
    "type": "suite",
    "floor": 5,
    "beds": "1 King",
    "capacity": 2,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Jacuzzi", "Balcony"],
    "pricePerNight": 249.99,
    "status": "available"
  }'

# 2. GET ROOMS (with various filters)
echo -e "\n\n===== Getting all rooms ====="
curl -X GET "${BASE_URL}" \
  -H "Content-Type: application/json"

echo -e "\n\n===== Getting rooms with filtering and pagination ====="
curl -X GET "${BASE_URL}?hotelId=60d21b4667d0d8992e610c85&type=deluxe&status=available&page=1&limit=10" \
  -H "Content-Type: application/json"

echo -e "\n\n===== Getting rooms by floor ====="
curl -X GET "${BASE_URL}?floor=3" \
  -H "Content-Type: application/json"

echo -e "\n\n===== Getting rooms by price range ====="
curl -X GET "${BASE_URL}?minPrice=100&maxPrice=200" \
  -H "Content-Type: application/json"

echo -e "\n\n===== Getting rooms by capacity ====="
curl -X GET "${BASE_URL}?capacity=4" \
  -H "Content-Type: application/json"

# 3. GET ROOM BY ID
echo -e "\n\n===== Getting room by ID ====="
curl -X GET "${BASE_URL}/60d21b4667d0d8992e610c90" \
  -H "Content-Type: application/json"

# 4. UPDATE ROOM
echo -e "\n\n===== Updating room details ====="
curl -X PATCH "${BASE_URL}/60d21b4667d0d8992e610c90" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "pricePerNight": 159.99,
    "amenities": ["WiFi", "TV", "Mini-bar", "Coffee maker", "Iron"],
    "status": "maintenance"
  }'

echo -e "\n\n===== Updating room type and capacity ====="
curl -X PATCH "${BASE_URL}/60d21b4667d0d8992e610c90" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "type": "suite",
    "capacity": 3,
    "pricePerNight": 199.99
  }'

# 5. DELETE ROOM
echo -e "\n\n===== Deleting a room ====="
curl -X DELETE "${BASE_URL}/60d21b4667d0d8992e610c90" \
  -H "Authorization: Bearer ${TOKEN}"

# 6. UPDATE ROOM STATUS
echo -e "\n\n===== Updating room status to occupied ====="
curl -X PATCH "${BASE_URL}/60d21b4667d0d8992e610c91/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "status": "occupied"
  }'

echo -e "\n\n===== Marking room as under maintenance ====="
curl -X PATCH "${BASE_URL}/60d21b4667d0d8992e610c92/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "status": "maintenance"
  }'

# 7. MARK ROOM AS CLEANED
echo -e "\n\n===== Marking room as cleaned ====="
curl -X PATCH "${BASE_URL}/60d21b4667d0d8992e610c92/clean" \
  -H "Authorization: Bearer ${TOKEN}"

echo -e "\n\nAll test requests completed!"