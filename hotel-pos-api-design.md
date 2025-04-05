# Hotel POS API Design Documentation

## Core Entities

### 1. Hotel
- Represents a hotel in the system
- Created by administrators
- Managed by hotel owners

### 2. User
- Different types: Administrator, Hotel Owner, Restaurant Manager, Housekeeper, Front Desk Employee
- Different access levels and capabilities
- Authentication and authorization

### 3. Room
- Belongs to a hotel
- Has status (available, occupied, maintenance)
- Has type and rate information

### 4. Guest
- Information about a guest
- Associated with a room during check-in
- Has billing information and service usage history

### 5. Service
- Types: Restaurant, Bar, Spa, Housekeeping, etc.
- Each with pricing and availability

### 6. Bill
- Accumulates charges from services
- Generated at checkout

## API Endpoints

### Administrator API

```
POST /api/hotels
GET /api/hotels
GET /api/hotels/{hotelId}
PUT /api/hotels/{hotelId}
DELETE /api/hotels/{hotelId}

POST /api/hotels/{hotelId}/access
DELETE /api/hotels/{hotelId}/access/{userId}
```

### Hotel Owner API

```
GET /api/hotels/{hotelId}
PUT /api/hotels/{hotelId}

POST /api/hotels/{hotelId}/users
GET /api/hotels/{hotelId}/users
GET /api/hotels/{hotelId}/users/{userId}
PUT /api/hotels/{hotelId}/users/{userId}
DELETE /api/hotels/{hotelId}/users/{userId}

POST /api/hotels/{hotelId}/rooms
GET /api/hotels/{hotelId}/rooms
GET /api/hotels/{hotelId}/rooms/{roomId}
PUT /api/hotels/{hotelId}/rooms/{roomId}
DELETE /api/hotels/{hotelId}/rooms/{roomId}

POST /api/hotels/{hotelId}/services
GET /api/hotels/{hotelId}/services
PUT /api/hotels/{hotelId}/services/{serviceId}
DELETE /api/hotels/{hotelId}/services/{serviceId}

GET /api/hotels/{hotelId}/reports/occupancy
GET /api/hotels/{hotelId}/reports/revenue
GET /api/hotels/{hotelId}/reports/services
```

### Front Desk API

```
GET /api/hotels/{hotelId}/rooms/available
POST /api/hotels/{hotelId}/guests
GET /api/hotels/{hotelId}/guests
GET /api/hotels/{hotelId}/guests/{guestId}

POST /api/hotels/{hotelId}/check-in
  {
    guestId: string,
    roomId: string,
    checkInTime: datetime,
    estimatedCheckOut: datetime,
    ...guestDetails
  }

POST /api/hotels/{hotelId}/check-out
  {
    guestId: string,
    checkOutTime: datetime,
    paymentMethod: string,
    ...paymentDetails
  }

GET /api/hotels/{hotelId}/guests/{guestId}/bill
```

### Service Staff API

```
GET /api/hotels/{hotelId}/guests/active
GET /api/hotels/{hotelId}/guests/{guestId}

POST /api/hotels/{hotelId}/guests/{guestId}/charges
  {
    serviceId: string,
    amount: number,
    description: string,
    timestamp: datetime
  }

GET /api/hotels/{hotelId}/services/{serviceId}/usage
```

## Authentication Flow

1. User authentication via:
   ```
   POST /api/auth/login
     {
       email: string,
       password: string
     }
   ```

2. Returns JWT token:
   ```
   {
     token: string,
     user: {
       id: string,
       name: string,
       role: string,
       hotelId: string (if applicable)
     }
   }
   ```

3. Token sent in Authorization header for subsequent requests:
   ```
   Authorization: Bearer {token}
   ```

## Key Workflows

### Hotel Creation Workflow
1. Administrator creates hotel via `POST /api/hotels`
2. Administrator assigns access to hotel owner via `POST /api/hotels/{hotelId}/access`
3. Hotel owner receives credentials

### Room Assignment Workflow
1. Front desk checks available rooms via `GET /api/hotels/{hotelId}/rooms/available`
2. Creates guest profile via `POST /api/hotels/{hotelId}/guests`
3. Assigns room via `POST /api/hotels/{hotelId}/check-in`

### Service Charge Workflow
1. Service staff locates guest via `GET /api/hotels/{hotelId}/guests/active`
2. Adds charge via `POST /api/hotels/{hotelId}/guests/{guestId}/charges`

### Checkout Workflow
1. Front desk retrieves bill via `GET /api/hotels/{hotelId}/guests/{guestId}/bill`
2. Processes checkout via `POST /api/hotels/{hotelId}/check-out`
3. Room status automatically updated to available after cleaning

## Data Models

### Hotel
```json
{
  "id": "string",
  "name": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string"
  },
  "contactPhone": "string",
  "contactEmail": "string",
  "amenities": ["string"],
  "active": "boolean",
  "subscriptionLevel": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### User
```json
{
  "id": "string",
  "hotelId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "role": "string", // Administrator, HotelOwner, FrontDesk, RestaurantManager, Housekeeper
  "active": "boolean",
  "lastLogin": "datetime",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Room
```json
{
  "id": "string",
  "hotelId": "string",
  "number": "string",
  "type": "string", // Standard, Deluxe, Suite, etc.
  "floor": "number",
  "capacity": "number",
  "pricePerNight": "number",
  "status": "string", // Available, Occupied, Maintenance, Cleaning
  "amenities": ["string"],
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Guest
```json
{
  "id": "string",
  "hotelId": "string",
  "roomId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "address": "object",
  "idType": "string", // Passport, Driver's License, etc.
  "idNumber": "string",
  "checkInTime": "datetime",
  "estimatedCheckOut": "datetime",
  "actualCheckOut": "datetime",
  "status": "string", // CheckedIn, CheckedOut
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Service
```json
{
  "id": "string",
  "hotelId": "string",
  "name": "string",
  "category": "string", // Restaurant, Bar, Spa, Housekeeping
  "description": "string",
  "pricing": "object", // Various pricing models
  "operatingHours": "object",
  "active": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Charge
```json
{
  "id": "string",
  "hotelId": "string",
  "guestId": "string",
  "serviceId": "string",
  "amount": "number",
  "description": "string",
  "timestamp": "datetime",
  "status": "string", // Pending, Billed, Paid, Refunded, Voided
  "staffId": "string", // User who processed the charge
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Bill
```json
{
  "id": "string",
  "hotelId": "string",
  "guestId": "string",
  "roomCharges": "number",
  "serviceCharges": "number",
  "taxes": "number",
  "discounts": "number",
  "total": "number",
  "status": "string", // Open, Closed, Paid
  "paymentMethod": "string",
  "paymentDetails": "object",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```





### current docs

## root admin init
```json
{
  "name": "Mayank sahu",
  "email": "mayanksahu0024@gmail.com",
  "phone": "+1-555-987-6543",
  "role": "system_admin",
  "permissions": ["create_hotel", "manage_users", "system_settings"],
  "password": "SecurePass123!"
}
```

