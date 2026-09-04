import mongoose from "mongoose";

const earningsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    earnings: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Earnings =
  mongoose.models.Earnings ||
  mongoose.model("Earnings", earningsSchema);

export default Earnings;