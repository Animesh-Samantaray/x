import Progress from "../models/Progress.model.js";
import Course from "../models/Course.model.js";
import Unit from "../models/Unit.model.js";


// Mark unit as completed
export const completeUnit = async (req, res) => {
  try {

    const { courseId, unitId } = req.params;

    
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const enrolledCourse = await Course.findOne({
      _id: courseId,
      enrolledStudents: req.user._id,
    });

    if (!enrolledCourse) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    // Check unit
    const unit = await Unit.findOne({
      _id: unitId,
      course: courseId,
    });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found in this course",
      });
    }

    
    let progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!progress) {
      progress = await Progress.create({
        user: req.user._id,
        course: courseId,
        completedUnits: [],
      });
    }

    
    let alreadyCompleted = false;

    for (const completedUnit of progress.completedUnits) {
      if (completedUnit.unit.toString() === unitId.toString()) {
        alreadyCompleted = true;
        break;
      }
    }

    if (!alreadyCompleted) {
      progress.completedUnits.push({
        unit: unitId,
        completedAt: new Date(),
      });
    }

    // Total units in course
    const totalUnits = await Unit.countDocuments({
      course: courseId,
    });

    const completedUnits = progress.completedUnits.length;

    const percentage =
      totalUnits > 0
        ? Math.round((completedUnits / totalUnits) * 100)
        : 0;

    progress.percentage = percentage;

    
    if (totalUnits > 0 && completedUnits >= totalUnits) {
      progress.completedAt = progress.completedAt || new Date();
    }

    await progress.save();

    return res.status(200).json({
      success: true,
      message: alreadyCompleted
        ? "Unit is already completed"
        : "Unit completed successfully",
      progress: {
        course: courseId,
        completedUnits,
        totalUnits,
        percentage,
        courseCompleted: percentage === 100,
      },
    });
  } catch (error) {
    console.error("Complete unit error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to complete unit",
      error: error.message,
    });
  }
};




export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    
    const enrolledCourse = await Course.findOne({
      _id: courseId,
      enrolledStudents: req.user._id,
    });

    if (!enrolledCourse) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const totalUnits = await Unit.countDocuments({
      course: courseId,
    });

    const progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    }).populate("completedUnits.unit", "title order");

    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          course: courseId,
          completedUnits: [],
          completedCount: 0,
          totalUnits,
          percentage: 0,
          courseCompleted: false,
        },
      });
    }

    const completedCount = progress.completedUnits.length;

    const percentage =
      totalUnits > 0
        ? Math.round((completedCount / totalUnits) * 100)
        : 0;

    return res.status(200).json({
      success: true,
      progress: {
        course: courseId,
        completedUnits: progress.completedUnits,
        completedCount,
        totalUnits,
        percentage,
        courseCompleted: percentage === 100,
        startedAt: progress.startedAt,
        completedAt: progress.completedAt,
      },
    });
  } catch (error) {
    console.error("Get course progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course progress",
      error: error.message,
    });
  }
};


export const uncompleteUnit = async (req, res) => {
  try {
    const { courseId, unitId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      enrolledStudents: req.user._id,
    });

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      });
    }

    const unit = await Unit.findOne({
      _id: unitId,
      course: courseId,
    });

    if (!unit) {
      return res.status(404).json({
        success: false,
        message: "Unit not found in this course",
      });
    }

    const progress = await Progress.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!progress) {
      return res.status(404).json({
        success: false,
        message: "Progress not found",
      });
    }

    progress.completedUnits = progress.completedUnits.filter(
      (completedUnit) =>
        completedUnit.unit.toString() !== unitId.toString()
    );

    const totalUnits = await Unit.countDocuments({
      course: courseId,
    });

    const completedUnits = progress.completedUnits.length;

    const percentage =
      totalUnits > 0
        ? Math.round((completedUnits / totalUnits) * 100)
        : 0;

    progress.percentage = percentage;
    progress.completedAt = null;

    await progress.save();

    return res.status(200).json({
      success: true,
      message: "Unit marked as incomplete",
      progress: {
        course: courseId,
        completedUnits,
        totalUnits,
        percentage,
        courseCompleted: false,
      },
    });
  } catch (error) {
    console.error("Uncomplete unit error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update unit progress",
      error: error.message,
    });
  }
};



export const getMyProgress = async (req, res) => {
  try {
    const progress = await Progress.find({
      user: req.user._id,
    })
      .populate("course", "title thumbnail")
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: progress.length,
      progress,
    });
  } catch (error) {
    console.error("Get my progress error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your progress",
      error: error.message,
    });
  }
};