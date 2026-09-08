import mongoose from "mongoose";
import Report from "../models/Report.model.js";
import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import Resource from "../models/resource.model.js";
import Unit from "../models/Unit.model.js";
import Review from "../models/Review.model.js";


export const takeModerationAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format.",
      });
    }

    const allowedActions = [
      "dismiss",
      "remove_content",
      "disable_user",
      "archive_course",
      "archive_resource",
      "delete_comment",
      "delete_review",
    ];

    if (!action || !allowedActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid moderation action specified.",
      });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    let actionTakenMessage = "";


    switch (action) {
      case "dismiss":
        report.status = "rejected";
        actionTakenMessage = "Report dismissed without taking action on content.";
        break;

      case "archive_course":
        if (report.targetType !== "course") {
          return res.status(400).json({
            success: false,
            message: "Archive course action is only valid for reported courses.",
          });
        }
        await Course.findByIdAndUpdate(report.targetId, { status: "archived" });
        report.status = "resolved";
        actionTakenMessage = "Reported course has been archived.";
        break;

      case "archive_resource":
        if (report.targetType !== "resource") {
          return res.status(400).json({
            success: false,
            message: "Archive resource action is only valid for reported resources.",
          });
        }
        await Resource.findByIdAndUpdate(report.targetId, { status: "archived" });
        report.status = "resolved";
        actionTakenMessage = "Reported resource has been archived.";
        break;

      case "delete_comment":
      case "delete_review":
        if (report.targetType !== "review" && report.targetType !== "comment") {
          return res.status(400).json({
            success: false,
            message: "Delete action is only valid for reported reviews or comments.",
          });
        }
        await Review.findByIdAndDelete(report.targetId);
        report.status = "resolved";
        actionTakenMessage = "Reported review/comment has been deleted.";
        break;

      case "disable_user":
        if (report.targetType !== "user") {
          return res.status(400).json({
            success: false,
            message: "Disable user action is only valid for reported users.",
          });
        }
       
        await User.findByIdAndUpdate(report.targetId, { isVerified: false });
        report.status = "resolved";
        actionTakenMessage = "Reported user account status has been updated.";
        break;

      case "remove_content":
      
        if (report.targetType === "course") {
          await Course.findByIdAndUpdate(report.targetId, { status: "archived" });
          actionTakenMessage = "Reported course archived.";
        } else if (report.targetType === "resource") {
          await Resource.findByIdAndUpdate(report.targetId, { status: "archived" });
          actionTakenMessage = "Reported resource archived.";
        } else if (report.targetType === "unit") {
          const unit = await Unit.findByIdAndDelete(report.targetId);
          if (unit) {
            await Course.findByIdAndUpdate(unit.course, { $pull: { units: unit._id } });
          }
          actionTakenMessage = "Reported unit deleted.";
        } else if (report.targetType === "review" || report.targetType === "comment") {
          await Review.findByIdAndDelete(report.targetId);
          actionTakenMessage = "Reported review/comment deleted.";
        } else if (report.targetType === "user") {
          await User.findByIdAndUpdate(report.targetId, { isVerified: false });
          actionTakenMessage = "Reported user account suspended/unverified.";
        }
        report.status = "resolved";
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Unsupported moderation action.",
        });
    }

    if (adminNote) {
      report.adminNote = adminNote.trim();
    }

    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();

    await report.save();

    const updatedReport = await Report.findById(id)
      .populate("reportedBy", "name email role profilePicture")
      .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      message: `Moderation action completed: ${actionTakenMessage}`,
      report: updatedReport,
    });
  } catch (error) {
    console.error("Take Moderation Action Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while taking moderation action.",
    });
  }
};
