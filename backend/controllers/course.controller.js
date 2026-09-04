
import Course from "../models/Course.model.js";
import Bookmark from "../models/Bookmark.model.js";
import Progress from "../models/Progress.model.js";
import Review from "../models/Review.model.js";
import Unit from "../models/Unit.model.js";
import Conversation from "../models/Conversation.model.js";
import User from "../models/User.model.js";
import {
  createCourseConversation as createCourseConvService,
  addParticipantToConversation,
  removeParticipantFromConversation,
} from "../services/conversation.service.js";
import { enrollInCourseService } from "../services/course.service.js";

 
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      thumbnail,
      category,
      topics,
      status,
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      thumbnail,
      category,
      topics,
      status: status || "published",
      createdBy: req.user._id,
      enrolledStudents: [],
      units: [],
      averageRating: 0,
      reviewCount: 0,
    });


    try {
      await createCourseConvService(course._id, course.createdBy);
    } catch (convErr) {
      console.error("Auto conversation creation error on course create:", convErr);
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

 

 
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      status: "published",
    })
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    const coursesWithRatings = await Promise.all(
      courses.map(async (c) => {
        const cObj = c.toObject();
        const reviews = await Review.find({ course: c._id });
        const reviewCount = reviews.length;
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        cObj.reviewCount = reviewCount;
        cObj.averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;
        return cObj;
      })
    );

    return res.status(200).json({
      success: true,
      count: coursesWithRatings.length,
      courses: coursesWithRatings,
    });
  } catch (error) {
    console.error("Get all courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
      error: error.message,
    });
  }
};

 

 
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("category", "name")
      .populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseObj = course.toObject();
    const reviews = await Review.find({ course: id });
    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
    courseObj.reviewCount = reviewCount;
    courseObj.averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      course: courseObj,
    });
  } catch (error) {
    console.error("Get course by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};

 
// GET MY CREATED COURSES
 
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      createdBy: req.user._id,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get my courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your courses",
      error: error.message,
    });
  }
};

 
// GET MY ENROLLED COURSES
 
export const getMyEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      enrolledStudents: req.user._id,
      status: "published",
    })
      .populate("category", "name")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
};

 
// UPDATE COURSE
 
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    const {
      title,
      description,
      thumbnail,
      category,
      topics,
      status,
    } = req.body;

    if (title !== undefined) {
      course.title = title;
    }

    if (description !== undefined) {
      course.description = description;
    }

    if (thumbnail !== undefined) {
      course.thumbnail = thumbnail;
    }

    if (category !== undefined) {
      course.category = category;
    }

    if (topics !== undefined) {
      course.topics = topics;
    }

    if (status !== undefined) {
      course.status = status;
    }

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

 
// DELETE COURSE
 
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    // Remove related data
    await Unit.deleteMany({ course: id });
    await Progress.deleteMany({ course: id });
    await Bookmark.deleteMany({ course: id });
    await Review.deleteMany({ course: id });
    await Conversation.deleteMany({ course: id });

    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

 
// GET ENROLLED STUDENTS
 
export const getEnrolledStudents = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("enrolledStudents", "_id name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      course.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view enrolled students",
      });
    }

    return res.status(200).json({
      success: true,
      count: course.enrolledStudents.length,
      students: course.enrolledStudents,
    });
  } catch (error) {
    console.error("Get enrolled students error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled students",
      error: error.message,
    });
  }
};

 
// ENROLL IN COURSE
 
export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const { progress, alreadyEnrolled } = await enrollInCourseService(id, userId);

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
      progress,
    });
  } catch (error) {
    console.error("Enroll in course error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to enroll in course",
      error: error.message,
    });
  }
};

 
// UNENROLL FROM COURSE
 
export const unenrollFromCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let enrolled = false;

    for (const studentId of course.enrolledStudents || []) {
      if (studentId.toString() === userId.toString()) {
        enrolled = true;
        break;
      }
    }

    if (!enrolled) {
      return res.status(400).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      (studentId) => studentId.toString() !== userId.toString()
    );

    await course.save();

    // Remove learner-specific data
    await Bookmark.deleteMany({
      user: userId,
      course: id,
    });

    await Progress.deleteOne({
      user: userId,
      course: id,
    });

    // Remove learner from course conversation
    try {
      const conv = await Conversation.findOne({ course: id });
      if (conv) {
        await removeParticipantFromConversation(conv._id, req.user._id);
      }
    } catch (convErr) {
      console.error("Remove learner from course conversation error:", convErr);
    }

    return res.status(200).json({
      success: true,
      message: "Unenrolled from course successfully",
    });
  } catch (error) {
    console.error("Unenroll from course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to unenroll from course",
      error: error.message,
    });
  }
};

