# 🧪 Testing Documentation: `makeReservationForGuest` Controller

This document outlines how to test the `/make-reservation` endpoint which handles creating a guest reservation and updating room status in a hotel booking system.

---

## ✅ Endpoint Description

**Route:** `POST /api/reservations/make`  
**Function:** `makeReservationForGuest`

Creates a reservation for a guest and marks the selected room as "occupied".

---

## 🔢 Request Body Parameters

| Field             | Type     | Description                                 | Required |
|------------------|----------|---------------------------------------------|----------|
| `reservationNumber` | `string` | Reference number for existing reservation    | ✅        |
| `paymentMethod`     | `string` | Payment type: `credit-card`, `cash`, `online` | ✅        |
| `cardInfo`          | `object` | Card details (`cardNumber`)                | ❌ (optional if not `credit-card`) |
| `billing`           | `object` | `{ total: number }`                        | ✅        |
| `guestId`           | `string` | ID of the guest                            | ✅        |
| `selectedRoom`      | `string` | ID of the room to be booked                | ✅        |
| `stayDetails`       | `object` | Check-in, check-out, adults, children      | ✅        |
| `addOns`            | `string[]` | Optional list of add-ons                  | ❌        |

---

## 📥 Sample Request

```json
POST /api/reservations/make

{
  "reservationNumber": "RES1234",
  "paymentMethod": "credit-card",
  "cardInfo": {
    "cardNumber": "4111111111111111"
  },
  "billing": {
    "total": 1200
  },
  "guestId": "guest_001",
  "selectedRoom": "room_101",
  "stayDetails": {
    "checkInDate": "2025-04-10",
    "checkOutDate": "2025-04-15",
    "adults": "2",
    "children": "1"
  },
  "addOns": ["breakfast", "airport-pickup"]
}
