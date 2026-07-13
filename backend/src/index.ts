import app from "./app";
import { connectDB } from "./database";
import { config } from "./config";

const start = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`Server running on ${config.port}`);
  });
};

start();