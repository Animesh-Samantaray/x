import Review from "../models/Review.model.js";
import Course from "../models/Course.model.js";

const updateCourseRatingStats = async (courseId) => {
  try {
    const reviews = await Review.find({ course: courseId });
    const reviewCount = reviews.length;
    const totalRating = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    const averageRating = reviewCount > 0 ? Number((totalRating / reviewCount).toFixed(1)) : 0;

    await Course.findByIdAndUpdate(courseId, {
      averageRating,
      reviewCount,
    });
  } catch (err) {
    console.error("Error updating course rating stats:", err);
  }
};

export const createReview = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let isEnrolled = false;

    for (const studentId of course.enrolledStudents || []) {
      if (studentId.toString() === req.user._id.toString()) {
        isEnrolled = true;
        break;
      }
    }

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: "You must be enrolled in this course to review it",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      course: courseId,
      rating,
      comment,
    });

    await review.populate("user", "name");
    await updateCourseRatingStats(courseId);

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message,
    });
  }
};

export const getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const reviews = await Review.find({
      course: courseId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    let totalRating = 0;

    for (const review of reviews) {
      totalRating += review.rating;
    }

    const averageRating =
      reviews.length > 0
        ? Number((totalRating / reviews.length).toFixed(1))
        : 0;

    return res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Get course reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course reviews",
      error: error.message,
    });
  }
};

export const getMyCourseReview = async (req, res) => {
  try {
    const { courseId } = req.params;

    const review = await Review.findOne({
      user: req.user._id,
      course: courseId,
    }).populate("user", "name");

    return res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    console.error("Get my review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your review",
      error: error.message,
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Rating and comment are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this review",
      });
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();
    await review.populate("user", "name");
    await updateCourseRatingStats(review.course);

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review",
      error: error.message,
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this review",
      });
    }

    const courseId = review.course;
    await Review.findByIdAndDelete(id);
    await updateCourseRatingStats(courseId);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      error: error.message,
    });
  }
};