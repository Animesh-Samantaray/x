import mongoose from "mongoose";

const mentorshipSessionSchema = new mongoose.Schema(
  {
  
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpertProfile",
      required: true,
    },

    
    learners: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },

        requestedAt: {
          type: Date,
          default: Date.now,
        },

        acceptedAt: {
          type: Date,
          default: null,
        },
      },
    ],

    title: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 15,
    },

    
    maxParticipants: {
      type: Number,
      default:100,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    meetingUrl: {
      type: String,
      trim: true,
      default: "",
    },

   
    status: {
      type: String,
      enum: [
        "open",
        "cancelled",
        "completed",
      ],
      default: "open",
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

const MentorshipSession = mongoose.model(
  "MentorshipSession",
  mentorshipSessionSchema
);

export default MentorshipSession;