import mongoose from "mongoose";
import Conversation from "../models/Conversation.model.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Drop old non-partial indexes if present and sync partial indexes
    try {
      await Conversation.collection.dropIndex("course_1").catch(() => {});
      await Conversation.collection.dropIndex("session_1").catch(() => {});
      await Conversation.syncIndexes().catch(() => {});
    } catch (indexErr) {
      console.log("Conversation index sync note:", indexErr.message);
    }
  } catch (error) {
    console.error("MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;