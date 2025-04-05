# Staff API Testing Documentation

## Base URL: http://localhost:8000/api/v1/staff

### 1. Create Staff Member (POST /create)
Required Role: HOTEL_OWNER or ADMIN
```bash
curl -X POST http://localhost:8000/api/v1/staff/create \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "hotelId": "65f123456789abcdef123456",
  "name": "John Doe",
  "email": "john.doe@hotel.com",
  "phone": "+1-555-987-6543",
  "role": "front_desk",
  "permissions": ["check_in", "check_out"],
  "password": "StaffPass123!"
}'

# Expected Success Response (201):
{
  "success": true,
  "data": {
    "_id": "65f123456789abcdef123457",
    "name": "John Doe",
    "email": "john.doe@hotel.com",
    "phone": "+1-555-987-6543",
    "role": "front_desk",
    "permissions": ["check_in", "check_out"],
    "status": "active",
    "hotelId": "65f123456789abcdef123456",
    "createdAt": "2024-03-13T10:00:00.000Z",
    "updatedAt": "2024-03-13T10:00:00.000Z"
  }
}
```

### 2. Staff Login (POST /login)
```bash
curl -X POST http://localhost:8000/api/v1/staff/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@hotel.com",
  "password": "StaffPass123!"
}'

# Expected Success Response (200):
{
  "success": true,
  "data": {
    "_id": "65f123456789abcdef123457",
    "name": "John Doe",
    "email": "john.doe@hotel.com",
    "role": "front_desk",
    "hotelId": "65f123456789abcdef123456"
  }
}
```

### 3. Get Staff by Hotel (GET /hotel/:hotelId)
Required Role: HOTEL_OWNER or ADMIN
```bash
curl -X GET "http://localhost:8000/api/v1/staff/hotel/65f123456789abcdef123456?page=1&limit=10&role=front_desk&status=active" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected Success Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "65f123456789abcdef123457",
      "name": "John Doe",
      "email": "john.doe@hotel.com",
      "role": "front_desk",
      "status": "active",
      "hotelId": "65f123456789abcdef123456"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "pages": 1
  }
}
```

### 4. Update Staff Member (PUT /:id)
Required Role: HOTEL_OWNER or ADMIN
```bash
curl -X PUT http://localhost:8000/api/v1/staff/65f123456789abcdef123457 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
-d '{
  "name": "John Doe Updated",
  "phone": "+1-555-987-6544",
  "role": "restaurant_manager",
  "permissions": ["manage_menu", "view_orders"],
  "status": "active"
}'

# Expected Success Response (200):
{
  "success": true,
  "data": {
    "_id": "65f123456789abcdef123457",
    "name": "John Doe Updated",
    "email": "john.doe@hotel.com",
    "phone": "+1-555-987-6544",
    "role": "restaurant_manager",
    "permissions": ["manage_menu", "view_orders"],
    "status": "active",
    "hotelId": "65f123456789abcdef123456",
    "updatedAt": "2024-03-13T11:00:00.000Z"
  }
}
```

### 5. Delete Staff Member (DELETE /:id)
Required Role: HOTEL_OWNER or ADMIN
```bash
curl -X DELETE http://localhost:8000/api/v1/staff/65f123456789abcdef123457 \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected Success Response (200):
{
  "success": true,
  "message": "Staff member deleted successfully"
}
```

### 6. Refresh Token (POST /refresh-token)
```bash
curl -X POST http://localhost:8000/api/v1/staff/refresh-token \
-H "Content-Type: application/json" \
-d '{
  "refreshToken": "YOUR_REFRESH_TOKEN"
}'

# Expected Success Response (200):
{
  "success": true,
  "accessToken": "NEW_ACCESS_TOKEN"
}
```

### 7. Logout Staff (POST /logout)
```bash
curl -X POST http://localhost:8000/api/v1/staff/logout \
-H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Expected Success Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Response Examples:
```json
// 400 Bad Request
{
  "success": false,
  "message": "All required fields must be provided"
}

// 401 Unauthorized
{
  "success": false,
  "message": "Invalid credentials"
}

// 403 Forbidden
{
  "success": false,
  "message": "Unauthorized to update staff from different hotel"
}

// 404 Not Found
{
  "success": false,
  "message": "Staff member not found"
}

// 409 Conflict
{
  "success": false,
  "message": "Staff member with this email already exists"
}
```

## Testing Sequence:
1. Create first hotel owner/admin
2. Login with created credentials
3. Use received token for subsequent requests
4. Create staff members
5. Test CRUD operations
6. Test permission restrictions
7. Test token refresh flow
8. Test logout

## Important Notes:
- Replace `YOUR_ACCESS_TOKEN` with actual JWT token received from login
- Replace `65f123456789abcdef123456` with actual MongoDB ObjectIds
- All protected routes require valid JWT token in Authorization header
- Ensure proper role and hotel association for operations
- Password must meet complexity requirements
- Tokens are automatically set as HTTP-only cookies in responses

Would you like me to provide Postman collection export for these endpoints as well?