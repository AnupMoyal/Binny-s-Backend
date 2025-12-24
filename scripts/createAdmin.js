// scripts/createAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const createAdmin = async () => {
  try {
    const adminEmail = "admin@example.com"; // default admin email
    const exists = await User.findOne({ email: adminEmail });

    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashed = await bcrypt.hash("Admin@123", 10); // default password

    const admin = await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashed,
      role: "ADMIN"
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
