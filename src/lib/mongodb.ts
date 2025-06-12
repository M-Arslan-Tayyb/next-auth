import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://arslancs5065:mahonarslan776@nextauthcluster.shfux0h.mongodb.net/";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

export const connectDB = async () => {
  try {
    if (mongoose.connection?.readyState >= 1) {
      console.log("✅ MongoDB already connected");
      return;
    }

    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
};
