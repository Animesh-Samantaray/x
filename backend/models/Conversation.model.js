import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: undefined,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorshipSession",
      default: undefined,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

conversationSchema.index(
  { course: 1 },
  {
    unique: true,
    partialFilterExpression: {
      course: { $type: "objectId" },
    },
  }
);

conversationSchema.index(
  { session: 1 },
  {
    unique: true,
    partialFilterExpression: {
      session: { $type: "objectId" },
    },
  }
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;