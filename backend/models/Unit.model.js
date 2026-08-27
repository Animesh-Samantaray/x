import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },

    attachments: [
      {
        title: {
          type: String,
          trim: true,
        },

        url: {
          type: String,
          required: true,
          trim: true,
        },

        type: {
          type: String,
          enum: ["document", "video", "image", "link", "other"],
          default: "other",
        },

        publicId: {
          type: String,
          trim: true,
        },

        resourceType: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Unit = mongoose.model("Unit", unitSchema);

export default Unit;