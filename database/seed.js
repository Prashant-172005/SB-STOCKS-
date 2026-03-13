/**
 * SB-STOCKS Database Seed Script
 * Run: node database/seed.js
 * Seeds admin user + sample users for testing
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/sb-stocks";

// ── Schemas (inline for seed script) ──────────────────────
const userSchema = new mongoose.Schema({
  username: String, email: String, password: String,
  role: { type: String, default: "user" },
  balance: { type: Number, default: 10000 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// ── Seed Data ──────────────────────────────────────────────
const seedUsers = [
  {
    username: "admin",
    email: "admin@sbstocks.com",
    password: "admin123",
    role: "admin",
    balance: 0,
  },
  {
    username: "alice",
    email: "alice@example.com",
    password: "alice123",
    role: "user",
    balance: 15000,
  },
  {
    username: "bob",
    email: "bob@example.com",
    password: "bob12345",
    role: "user",
    balance: 8500,
  },
  {
    username: "charlie",
    email: "charlie@example.com",
    password: "charlie1",
    role: "user",
    balance: 22000,
  },
];

// ── Main ───────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Clear existing users
    await User.deleteMany({});
    console.log("🗑️  Cleared existing users");

    // Hash passwords + insert
    const hashed = await Promise.all(
      seedUsers.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );

    await User.insertMany(hashed);
    console.log(`✅ Seeded ${hashed.length} users:`);
    seedUsers.forEach(u => console.log(`   • ${u.role.padEnd(6)} ${u.username} / ${u.password}`));

    console.log("\n🚀 Seed complete! Start the server with: cd server && npm run dev");
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seed();
