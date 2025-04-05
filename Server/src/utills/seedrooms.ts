// MongoDB Room Seeding Payloads
// This file contains sample payloads for creating rooms with various configurations

import { Types } from 'mongoose';

// Sample hotel IDs - replace with actual IDs from your database
const hotelIds = [
  new Types.ObjectId("60d21b4667d0d8992e610c85"), // Luxury hotel
  new Types.ObjectId("60d21b4667d0d8992e610c85"), // Budget hotel
  new Types.ObjectId("60d21b4667d0d8992e610c85")  // Boutique hotel
];

// Room Types from your enum
const roomTypes = {
  STANDARD: 'standard',
  DELUXE: 'deluxe',
  SUITE: 'suite',
  ACCESSIBLE: 'Accessible'
};

// Room Status from your enum
const roomStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  CLEANING: 'cleaning'
};

// Common amenities options
const amenitiesSets = {
  basic: ['TV', 'WiFi', 'Air conditioning'],
  standard: ['TV', 'WiFi', 'Air conditioning', 'Mini fridge', 'Coffee maker'],
  deluxe: ['TV', 'WiFi', 'Air conditioning', 'Mini fridge', 'Coffee maker', 'Safe', 'Premium toiletries'],
  suite: ['TV', 'WiFi', 'Air conditioning', 'Mini fridge', 'Coffee maker', 'Safe', 'Premium toiletries', 'Sitting area', 'Bathtub', 'Balcony'],
  accessible: ['TV', 'WiFi', 'Air conditioning', 'Accessible bathroom', 'Wheelchair ramp', 'Lowered counters']
};

// Bed configurations
const bedOptions = {
  singleBed: '1 Single',
  twinBeds: '2 Singles',
  queenBed: '1 Queen',
  kingBed: '1 King',
  doubleQueens: '2 Queens',
  queenAndSingle: '1 Queen, 1 Single',
  kingAndSofa: '1 King, 1 Sofa bed'
};

// Generate room payloads
export const roomPayloads = [
  // STANDARD ROOMS - Various statuses and configurations
  {
    hotelId: hotelIds[0],
    roomNumber: '101',
    type: roomTypes.STANDARD,
    floor: 1,
    beds: bedOptions.twinBeds,
    capacity: 2,
    amenities: amenitiesSets.standard,
    pricePerNight: 89.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  {
    hotelId: hotelIds[0],
    roomNumber: '102',
    type: roomTypes.STANDARD,
    floor: 1,
    beds: bedOptions.queenBed,
    capacity: 2,
    amenities: amenitiesSets.standard,
    pricePerNight: 99.99,
    status: roomStatus.OCCUPIED,
    lastCleaned: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
  },
  {
    hotelId: hotelIds[0],
    roomNumber: '103',
    type: roomTypes.STANDARD,
    floor: 1,
    beds: bedOptions.twinBeds,
    capacity: 2,
    amenities: amenitiesSets.standard,
    pricePerNight: 89.99,
    status: roomStatus.CLEANING,
    lastCleaned: null // Never cleaned
  },
  {
    hotelId: hotelIds[1],
    roomNumber: '101',
    type: roomTypes.STANDARD,
    floor: 1,
    beds: bedOptions.queenBed,
    capacity: 2,
    amenities: amenitiesSets.basic,
    pricePerNight: 69.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  
  // DELUXE ROOMS
  {
    hotelId: hotelIds[0],
    roomNumber: '201',
    type: roomTypes.DELUXE,
    floor: 2,
    beds: bedOptions.kingBed,
    capacity: 2,
    amenities: amenitiesSets.deluxe,
    pricePerNight: 149.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  {
    hotelId: hotelIds[0],
    roomNumber: '202',
    type: roomTypes.DELUXE,
    floor: 2,
    beds: bedOptions.doubleQueens,
    capacity: 4,
    amenities: amenitiesSets.deluxe,
    pricePerNight: 179.99,
    status: roomStatus.MAINTENANCE,
    lastCleaned: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
  },
  {
    hotelId: hotelIds[2],
    roomNumber: '201',
    type: roomTypes.DELUXE,
    floor: 2,
    beds: bedOptions.kingBed,
    capacity: 2,
    amenities: [...amenitiesSets.deluxe, 'Designer furniture', 'City view'],
    pricePerNight: 199.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  
  // SUITES
  {
    hotelId: hotelIds[0],
    roomNumber: '301',
    type: roomTypes.SUITE,
    floor: 3,
    beds: bedOptions.kingAndSofa,
    capacity: 3,
    amenities: [...amenitiesSets.suite, 'Kitchenette', 'Dining area'],
    pricePerNight: 259.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  {
    hotelId: hotelIds[0],
    roomNumber: '302',
    type: roomTypes.SUITE,
    floor: 3,
    beds: bedOptions.kingBed,
    capacity: 2,
    amenities: [...amenitiesSets.suite, 'Jacuzzi', 'Separate living room', 'Ocean view'],
    pricePerNight: 299.99,
    status: roomStatus.OCCUPIED,
    lastCleaned: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    hotelId: hotelIds[2],
    roomNumber: '301',
    type: roomTypes.SUITE,
    floor: 3,
    beds: bedOptions.kingAndSofa,
    capacity: 4,
    amenities: [...amenitiesSets.suite, 'Full kitchen', 'Dining area', 'Fireplace', 'Private terrace'],
    pricePerNight: 349.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  
  // ACCESSIBLE ROOMS
  {
    hotelId: hotelIds[0],
    roomNumber: '105',
    type: roomTypes.ACCESSIBLE,
    floor: 1,
    beds: bedOptions.queenBed,
    capacity: 2,
    amenities: amenitiesSets.accessible,
    pricePerNight: 99.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  {
    hotelId: hotelIds[1],
    roomNumber: '105',
    type: roomTypes.ACCESSIBLE,
    floor: 1,
    beds: bedOptions.twinBeds,
    capacity: 2,
    amenities: amenitiesSets.accessible,
    pricePerNight: 79.99,
    status: roomStatus.OCCUPIED,
    lastCleaned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
  },
  
  // Additional variations for edge cases
  {
    hotelId: hotelIds[0],
    roomNumber: '401', // Different floor
    type: roomTypes.STANDARD,
    floor: 4,
    beds: bedOptions.queenAndSingle,
    capacity: 3,
    amenities: amenitiesSets.standard,
    pricePerNight: 119.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date()
  },
  {
    hotelId: hotelIds[0],
    roomNumber: '501',
    type: roomTypes.DELUXE,
    floor: 5,
    beds: bedOptions.kingBed,
    capacity: 2,
    amenities: [...amenitiesSets.deluxe, 'Executive desk', 'Complimentary breakfast'],
    pricePerNight: 169.99,
    status: roomStatus.AVAILABLE,
    lastCleaned: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000) // 12 hours ago
  }
];

// Function to create a single room
export const createSampleRoom = (index = 0) => {
  return roomPayloads[index % roomPayloads.length];
};

// Function to create multiple rooms for a specific hotel
export const createHotelRooms = (hotelId : any ,  count = 5) => {
  const rooms = [];
  for (let i = 0; i < count; i++) {
    const baseRoom = createSampleRoom(i);
    rooms.push({
      ...baseRoom,
      hotelId,
      roomNumber: `${i + 101}`, // Ensures unique room numbers
    });
  }
  return rooms;
};

// Usage example for your API:
// const roomPayload = createSampleRoom();
// or
// const hotelRooms = createHotelRooms("60d21b4667d0d8992e610c85", 90);

// console.log(hotelRooms);
