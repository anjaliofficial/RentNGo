import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,

  mongoUri: process.env.MONGODB_URI!,

  clientUrl: process.env.CLIENT_URL!,

  jwtSecret: process.env.JWT_SECRET!,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
};