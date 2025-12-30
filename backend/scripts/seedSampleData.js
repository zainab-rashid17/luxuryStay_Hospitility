/**
 * Seed sample data into MongoDB (admin + guest + rooms + sample reservations/bills).
 * Usage:
 *   cd backend && node scripts/seedSampleData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Room = require('../models/Room');
const Reservation = require('../models/Reservation');
const Billing = require('../models/Billing');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/luxurystay';

async function connect() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB');
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Room.deleteMany({}),
    Reservation.deleteMany({}),
    Billing.deleteMany({}),
  ]);
  console.log('🧹 Cleared users, rooms, reservations, billing');
}

async function seed() {
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
    isActive: true,
  });

  const guest = await User.create({
    name: 'Guest User',
    email: 'guest@example.com',
    password: 'Guest@123',
    role: 'guest',
    isActive: true,
  });

  const rooms = await Room.insertMany([
    {
      roomNumber: '101',
      roomType: 'Deluxe Suite',
      price: 220,
      capacity: 2,
      status: 'available',
      amenities: ['WiFi', 'Breakfast', 'Pool Access'],
      images: [],
    },
    {
      roomNumber: '202',
      roomType: 'Executive King',
      price: 180,
      capacity: 2,
      status: 'available',
      amenities: ['WiFi', 'Gym', 'City View'],
      images: [],
    },
  ]);

  const reservation = await Reservation.create({
    guestId: guest._id,
    roomId: rooms[0]._id,
    checkInDate: new Date(),
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: 'confirmed',
    totalPrice: 660,
    paymentStatus: 'paid',
  });

  await Billing.create({
    reservationId: reservation._id,
    guestId: guest._id,
    totalAmount: 660,
    roomCharges: 660,
    taxes: 0,
    additionalServices: [],
    paymentStatus: 'paid',
    issuedAt: new Date(),
  });

  console.log('✅ Seeded admin, guest, rooms, reservation, billing');
  console.log('   Admin login: admin@example.com / Admin@123');
  console.log('   Guest login: guest@example.com / Guest@123');
}

async function run() {
  try {
    await connect();
    await clearCollections();
    await seed();
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected');
  }
}

run();

