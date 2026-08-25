import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    topics: [
      {
        type: String,
        trim: true,
      },
    ],

    documents: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        publicId: {
          type: String,
          trim: true,
        },
        mimeType: {
          type: String,
          trim: true,
        },
        resourceType: {
          type: String,
          trim: true,
        },
      },
    ],

    links: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    thumbnail: {
      type: String,
      default:"https://img.magnific.com/free-vector/vintage-collage-frame-wallpaper-background-illustration-vector-paper-texture-with-design-space_53876-140661.jpg?semt=ais_hybrid&w=740&q=80",
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;