import Course from "../models/Course.model.js";
import Progress from "../models/Progress.model.js";
import Conversation from "../models/Conversation.model.js";
import {
  createCourseConversation as createCourseConvService,
  addParticipantToConversation,
} from "./conversation.service.js";

export const enrollInCourseService = async (courseId, userId) => {
  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  if (course.status !== "published") {
    const error = new Error("Cannot enroll in a non-published course");
    error.statusCode = 400;
    throw error;
  }

  let alreadyEnrolled = false;
  for (const studentId of course.enrolledStudents || []) {
    if (studentId.toString() === userId.toString()) {
      alreadyEnrolled = true;
      break;
    }
  }

  let progress = await Progress.findOne({
    user: userId,
    course: course._id,
  });

  if (alreadyEnrolled) {
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: course._id,
        completedUnits: [],
        percentage: 0,
      });
    }

    try {
      let conv = await Conversation.findOne({ course: course._id });
      if (conv) {
        await addParticipantToConversation(conv._id, userId);
      } else {
        conv = await createCourseConvService(course._id, course.createdBy);
        await addParticipantToConversation(conv._id, userId);
      }
    } catch (convErr) {
      console.error("Add learner to course conversation error:", convErr);
    }

    return { course, progress, alreadyEnrolled: true };
  }

  course.enrolledStudents.push(userId);
  await course.save();

  if (!progress) {
    progress = await Progress.create({
      user: userId,
      course: course._id,
      completedUnits: [],
      percentage: 0,
    });
  }


  try {
    let conv = await Conversation.findOne({ course: course._id });
    if (conv) {
      await addParticipantToConversation(conv._id, userId);
    } else {
      conv = await createCourseConvService(course._id, course.createdBy);
      await addParticipantToConversation(conv._id, userId);
    }
  } catch (convErr) {
    console.error("Add learner to course conversation error:", convErr);
  }

  return { course, progress, alreadyEnrolled: false };
};

export default {
  enrollInCourseService,
};
