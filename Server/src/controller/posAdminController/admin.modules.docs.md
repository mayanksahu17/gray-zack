# Administrator API Testing Guide

## Base URL: http://localhost:8000/api/v1.0/admin

### 1. Create First Administrator (System Admin) - No Authentication Required
```bash
curl -X POST http://localhost:8000/api/v1.0/admin/initialize \
-H "Content-Type: application/json" \
-d '{
  "name": "System Admin",
  "email": "sysadmin@example.com",
  "phone": "+1-555-987-6543",
  "role": "system_admin",
  "permissions": [
    "create_hotel",
    "manage_subscriptions",
    "view_all_data",
    "manage_users",
    "system_settings",
    "audit_logs",
    "support_tickets"
  ],
  "password": "SecurePass123!"
}'

# Expected Success Response (201):
{
  "success": true,
  "data": {
    "_id": "65f123456789abcdef123456",
    "name": "System Admin",
    "email": "sysadmin@example.com",
    "phone": "+1-555-987-6543",
    "role": "system_admin",
    "permissions": [
      "create_hotel",
      "manage_subscriptions",
      "view_all_data",
      "manage_users",
      "system_settings",
      "audit_logs",
      "support_tickets"
    ],
    "status": "active",
    "createdAt": "2024-03-13T10:00:00.000Z",
    "updatedAt": "2024-03-13T10:00:00.000Z"
  }
}
```

### 2. Login as System Admin
```bash
curl -X POST http://localhost:8000/api/v1.0/admin/login \
-H "Content-Type: application/json" \
-c cookies.txt \
-d '{
  "email": "sysadmin@example.com",
  "password": "SecurePass123!"
}'

# Expected Success Response (200):
{
  "success": true,
  "data": {
    "_id": "65f123456789abcdef123456",
    "email": "sysadmin@example.com",
    "name": "System Admin",
    "role": "system_admin",
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 3. Create Hotel Admin (Requires System Admin Authentication)
```bash
curl -X POST http://localhost:8000/api/v1.0/admin/create \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{
  "name": "Hotel Admin",
  "email": "hoteladmin@example.com",
  "phone": "+1-555-987-6544",
  "role": "hotel_admin",
  "permissions": [
    "create_hotel",
    "manage_users",
    "support_tickets"
  ],
  "password": "HotelAdmin123!"
}'

# Expected Success Response (201):
{
  "success": true,
  "data": {
    "_id": "65f123456789abcdef123457",
    "name": "Hotel Admin",
    "email": "hoteladmin@example.com",
    "phone": "+1-555-987-6544",
    "role": "hotel_admin",
    "permissions": [
      "create_hotel",
      "manage_users",
      "support_tickets"
    ],
    "status": "active",
    "createdAt": "2024-03-13T10:30:00.000Z",
    "updatedAt": "2024-03-13T10:30:00.000Z"
  }
}
```

### 4. Verify Created Hotel Admin (List Administrators)
```bash
curl -X POST "http://localhost:8000/api/v1.0/admin?page=1&limit=10" \
-H "Content-Type: application/json" \
-b cookies.txt

# Expected Success Response (200):
{
  "success": true,
  "data": [
    {
      "_id": "65f123456789abcdef123457",
      "name": "Hotel Admin",
      "email": "hoteladmin@example.com",
      "role": "hotel_admin",
      "status": "active"
    },
    {
      "_id": "65f123456789abcdef123456",
      "name": "System Admin",
      "email": "sysadmin@example.com",
      "role": "system_admin",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "pages": 1
  }
}
```

### 5. Logout
```bash
curl -X POST http://localhost:8000/api/v1.0/admin/logout \
-b cookies.txt

# Expected Success Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Error Cases to Test:

1. Creating Admin with Existing Email:
```bash
curl -X POST http://localhost:8000/api/v1.0/admin/create \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{
  "name": "Duplicate Admin",
  "email": "hoteladmin@example.com",
  "phone": "+1-555-987-6545",
  "role": "hotel_admin",
  "password": "Password123!"
}'

# Expected Error Response (409):
{
  "success": false,
  "message": "Administrator with this email already exists"
}
```

2. Invalid Password Format:
```bash
curl -X POST http://localhost:8000/api/v1.0/admin/create \
-H "Content-Type: application/json" \
-b cookies.txt \
-d '{
  "name": "Hotel Admin",
  "email": "newadmin@example.com",
  "phone": "+1-555-987-6546",
  "role": "hotel_admin",
  "password": "weak"
}'

# Expected Error Response (400):
{
  "success": false,
  "message": "Password must contain at least 8 characters, including uppercase, lowercase, number and special character"
}
```

## Testing Notes:
1. Replace `http://localhost:8000` with your actual API base URL
2. The `-c cookies.txt` flag saves cookies from the response
3. The `-b cookies.txt` flag sends cookies with the request
4. Ensure proper phone number format: `+{country-code}-{xxx}-{xxx}-{xxxx}`
5. Valid roles are: `system_admin`, `hotel_admin`, `staff_admin`
6. Valid permissions are:
   - create_hotel
   - manage_subscriptions
   - view_all_data
   - manage_users
   - system_settings
   - audit_logs
   - support_tickets

Would you like me to provide any additional test cases or explain any part in more detail?