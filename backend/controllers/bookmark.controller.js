import mongoose from "mongoose";
import Bookmark from "../models/Bookmark.model.js";
import Course from "../models/Course.model.js";
import Unit from "../models/Unit.model.js";


export const createBookmark = async (req, res) => {
  try {
    const { courseId, unitId, attachmentId } = req.body;

    if (!courseId || !unitId || !attachmentId) {
      return res.status(400).json({
        success: false,
        message: "courseId, unitId, and attachmentId are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(unitId) ||
      !mongoose.Types.ObjectId.isValid(attachmentId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ObjectId provided",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const unit = await Unit.findById(unitId);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found",
      });
    }

    
    if (unit.course.toString() !== courseId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Unit does not belong to the specified course",
      });
    }


    const attachment = unit.attachments.id(attachmentId);
    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: "Attachment not found in unit",
      });
    }


    const isAdmin = req.user.role === "admin";
    const isOwner = course.createdBy.toString() === req.user._id.toString();
    const isEnrolled = course.enrolledStudents?.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isOwner && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to bookmark attachments in this course",
      });
    }

   
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      course: courseId,
      unit: unitId,
      attachmentId,
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: "Attachment is already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      course: courseId,
      unit: unitId,
      attachmentId,
    });

    return res.status(201).json({
      success: true,
      message: "Bookmark created successfully",
      bookmark,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Attachment is already bookmarked",
      });
    }

    console.error("Create bookmark error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create bookmark",
      error: error.message,
    });
  }
};


export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid bookmark ID",
      });
    }

    const bookmark = await Bookmark.findById(id);
    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    const isOwner = bookmark.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this bookmark",
      });
    }

    await Bookmark.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Bookmark removed successfully",
    });
  } catch (error) {
    console.error("Delete bookmark error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete bookmark",
      error: error.message,
    });
  }
};


export const getMyBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate("course", "title thumbnail category")
      .populate("unit", "title order attachments")
      .sort({ createdAt: -1 });

    const formattedBookmarks = bookmarks.map((b) => {
      const unitDoc = b.unit;
      let attachment = null;

      if (unitDoc && unitDoc.attachments && unitDoc.attachments.length > 0) {
        if (typeof unitDoc.attachments.id === "function") {
          attachment = unitDoc.attachments.id(b.attachmentId);
        }
        if (!attachment) {
          attachment = unitDoc.attachments.find(
            (att) => String(att._id) === String(b.attachmentId)
          );
        }
      }

      return {
        _id: b._id,
        course: b.course,
        unit: {
          _id: unitDoc?._id,
          title: unitDoc?.title,
          order: unitDoc?.order,
        },
        attachmentId: b.attachmentId,
        attachment: attachment
          ? {
              _id: attachment._id,
              title: attachment.title,
              url: attachment.url,
              type: attachment.type,
            }
          : null,
        createdAt: b.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedBookmarks.length,
      bookmarks: formattedBookmarks,
    });
  } catch (error) {
    console.error("Get my bookmarks error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
      error: error.message,
    });
  }
};


export const getCourseBookmarks = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isAdmin = req.user.role === "admin";
    const isOwner = course.createdBy.toString() === req.user._id.toString();
    const isEnrolled = course.enrolledStudents?.some(
      (studentId) => studentId.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isOwner && !isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view bookmarks for this course",
      });
    }

    const bookmarks = await Bookmark.find({
      user: req.user._id,
      course: courseId,
    });

    return res.status(200).json({
      success: true,
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error("Get course bookmarks error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course bookmarks",
      error: error.message,
    });
  }
};
