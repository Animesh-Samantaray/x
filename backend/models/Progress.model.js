import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completedUnits: [
      {
        unit: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Unit",
          required: true,
        },

        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

const Progress =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default Progress;