import Course from "../models/Course.model.js";
import Bookmark from "../models/Bookmark.model.js";

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
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};


export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("category", "name")
      .populate("createdBy", "name email")
      .populate("enrolledStudents", "_id name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
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
      .populate("createdBy", "name email")
      .populate("enrolledStudents", "_id name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course",
      error: error.message,
    });
  }
};


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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch your courses",
      error: error.message,
    });
  }
};


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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
};


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

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.thumbnail = thumbnail ?? course.thumbnail;
    course.category = category ?? course.category;
    course.topics = topics ?? course.topics;
    course.status = status ?? course.status;

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};


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

    await Course.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};


export const getEnrolledStudents = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id)
      .populate("enrolledStudents", "name email");

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
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled students",
      error: error.message,
    });
  }
};


export const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.status !== "published") {
      return res.status(400).json({
        success: false,
        message: "Cannot enroll in a non-published course",
      });
    }

    
    let alreadyEnrolled = false;

    for (const studentId of course.enrolledStudents || []) {
      if (studentId.toString() === req.user._id.toString()) {
        alreadyEnrolled = true;
        break;
      }
    }

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    course.enrolledStudents.push(req.user._id);

    await course.save();

    return res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
    });
  } catch (error) {
    console.error("Enroll in course error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
      error: error.message,
    });
  }
};

export const unenrollFromCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let enrolled = false;

    for (const studentId of course.enrolledStudents || []) {
      if (studentId.toString() === req.user._id.toString()) {
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
      (studentId) =>
        studentId.toString() !== req.user._id.toString()
    );

    await course.save();

    
    await Bookmark.deleteMany({
      user: req.user._id,
      course: id,
    });

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