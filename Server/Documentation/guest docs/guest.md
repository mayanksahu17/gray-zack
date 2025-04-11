Here's a **complete API documentation** for your Guest-related endpoints with the base URL:

```
Base URL: http://localhost:8000/api/v1/guest/
```

---

## 📘 Guest API Documentation

All endpoints below are under the base path: `/api/v1/guest/`

---

### 📌 1. **Create a New Guest**

- **URL**: `POST /`
- **Description**: Creates a new guest if not already present (based on email, phone, or ID number).
- **Request Body** (`application/json`):

```json
{
  "hotelId": "67dd8f8173deaf59ece8e7f3",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "idType": "passport",
    "idNumber": "X1234567",
    "nationality": "American",
    "reservationNumber": "R12345"
  },
  "preferences": ["non-smoking", "king bed"],
  "isCorporateGuest": false,
  "companyName": "",
  "notes": "VIP guest"
}
```

- **Success Response**:
  - **Status**: `201 Created`
  - **Body**:
```json
{
  "message": "Guest created successfully",
  "guestId": "64ef9ab7c2489b409831dc19"
}
```

- **Duplicate Guest Response**:
  - **Status**: `200 OK`
  - **Body**:
```json
{
  "message": "Guest already exists",
  "guestId": "64ef9ab7c2489b409831dc19"
}
```

---

### 📌 2. **Get Guest by ID**

- **URL**: `GET /:id`
- **Example**: `GET /64ef9ab7c2489b409831dc19`
- **Description**: Retrieves a guest's full profile by their MongoDB ObjectId.
- **Response**:
  - **Status**: `200 OK`
  - **Body**: Full guest object

---

### 📌 3. **Get All Guests for a Hotel**

- **URL**: `GET /hotel/:hotelId`
- **Example**: `GET /hotel/64e7346e9d9a4d2d88b12a34`
- **Description**: Retrieves all guests associated with a specific hotel.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:
```json
[
  {
    "_id": "64ef9ab7c2489b409831dc19",
    "hotelId": "64e7346e9d9a4d2d88b12a34",
    "personalInfo": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      ...
    },
    ...
  }
]
```

---

### 📌 4. **Update Guest**

- **URL**: `PUT /:id`
- **Example**: `PUT /64ef9ab7c2489b409831dc19`
- **Description**: Updates the guest's information.
- **Request Body**: Partial or full guest object (same format as creation).
- **Response**:
  - **Status**: `200 OK`
  - **Body**:
```json
{
  "message": "Guest updated successfully",
  "guest": { ...updated guest object... }
}
```

---

### 📌 5. **Delete Guest**

- **URL**: `DELETE /:id`
- **Example**: `DELETE /64ef9ab7c2489b409831dc19`
- **Description**: Permanently deletes the guest by ID.
- **Response**:
  - **Status**: `200 OK`
  - **Body**:
```json
{
  "message": "Guest deleted successfully"
}
```

---

### 📌 6. **Search Guests**

- **URL**: `GET /search`
- **Query Parameters**:
  - `email` (optional)
  - `phone` (optional)
  - `idNumber` (optional)
- **Example**:  
  `GET /search?email=john@example.com`  
  `GET /search?phone=+1234567890&idNumber=X1234567`
- **Response**:
  - **Status**: `200 OK`
  - **Body**: Array of matched guest objects

---

## 🔐 Error Responses

| Code | Message                        |
|------|--------------------------------|
| 400  | Missing required parameters    |
| 404  | Guest not found                |
| 500  | Internal Server Error          |

---

## 🧪 Testing Tips (Postman / Curl)

### ➤ Create Guest
```bash
curl -X POST http://localhost:8000/api/v1/guest/ \
  -H "Content-Type: application/json" \
  -d '{"hotelId":"...", "personalInfo":{...}, ...}'
```

### ➤ Search Guest by Email
```bash
curl http://localhost:8000/api/v1/guest/search?email=john@example.com
```

---

Let me know if you want this exported as a **Swagger/OpenAPI spec**, a **PDF**, or embedded into a frontend developer portal!