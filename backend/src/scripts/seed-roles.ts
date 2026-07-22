import mongoose from "mongoose";

import { connectDB } from "../database";
import User from "../models/user.model";
import { hashPassword } from "../utils/password";

/**
 * Seeds exactly one static admin and one static moderator account.
 * Safe to re-run: if an account with the email already exists, only its
 * role is corrected — its password is left untouched so this never
 * clobbers a password that was already changed via Settings.
 *
 * Override the defaults with env vars: ADMIN_EMAIL, ADMIN_PASSWORD,
 * MODERATOR_EMAIL, MODERATOR_PASSWORD.
 */
const ACCOUNTS = [
  {
    role: "admin",
    fullName: "Platform Admin",
    email: process.env.ADMIN_EMAIL || "admin@rentngo.com",
    password: process.env.ADMIN_PASSWORD || "Admin@12345",
  },
  {
    role: "moderator",
    fullName: "Platform Moderator",
    email: process.env.MODERATOR_EMAIL || "moderator@rentngo.com",
    password: process.env.MODERATOR_PASSWORD || "Moderator@12345",
  },
];

const run = async () => {
  await connectDB();

  for (const account of ACCOUNTS) {
    const existing = await User.findOne({ email: account.email });

    if (existing) {
      if (existing.role !== account.role) {
        existing.role = account.role;
        await existing.save();
        console.log(`Updated role for ${account.email} -> ${account.role}`);
      } else {
        console.log(`${account.email} already has role ${account.role}, nothing to do.`);
      }
      continue;
    }

    const hashedPassword = await hashPassword(account.password);

    await User.create({
      fullName: account.fullName,
      email: account.email,
      password: hashedPassword,
      role: account.role,
      emailVerified: true,
      verificationStatus: "approved",
    });

    console.log(`Created ${account.role} account: ${account.email} / ${account.password}`);
  }

  await mongoose.disconnect();
  console.log("Done.");
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
