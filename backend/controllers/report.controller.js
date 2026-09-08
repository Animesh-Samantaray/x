import mongoose from "mongoose";
import Report from "../models/Report.model.js";
import User from "../models/User.model.js";
import Course from "../models/Course.model.js";
import Resource from "../models/resource.model.js";
import Unit from "../models/Unit.model.js";
import Review from "../models/Review.model.js";


const verifyTargetExists = async (targetType, targetId) => {
  if (!mongoose.Types.ObjectId.isValid(targetId)) {
    return false;
  }

  switch (targetType) {
    case "user":
      return await User.findById(targetId);
    case "course":
      return await Course.findById(targetId);
    case "resource":
      return await Resource.findById(targetId);
    case "unit":
      return await Unit.findById(targetId);
    case "review":
    case "comment":
      return await Review.findById(targetId);
    default:
      return false;
  }
};

export const createReport = async (req, res) => {
  try {
    const { targetType, targetId, reason, description } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({
        success: false,
        message: "Target type, target ID, and reason are required.",
      });
    }

    const allowedTypes = ["user", "course", "resource", "unit", "comment", "review"];
    if (!allowedTypes.includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid target type specified.",
      });
    }

    const allowedReasons = [
      "spam",
      "harassment",
      "inappropriate_content",
      "copyright",
      "misinformation",
      "fraud",
      "abuse",
      "other",
    ];
    if (!allowedReasons.includes(reason)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report reason specified.",
      });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description must not exceed 1000 characters.",
      });
    }

 
    const targetEntity = await verifyTargetExists(targetType, targetId);
    if (!targetEntity) {
      return res.status(404).json({
        success: false,
        message: "Reported target content does not exist.",
      });
    }

  
    const existingReport = await Report.findOne({
      reportedBy: req.user._id,
      targetType,
      targetId,
      status: { $in: ["pending", "reviewing"] },
    });

    if (existingReport) {
      return res.status(409).json({
        success: false,
        message: "You have already submitted an active report for this content.",
      });
    }

    const report = await Report.create({
      reportedBy: req.user._id,
      targetType,
      targetId,
      reason,
      description: description ? description.trim() : "",
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully. Our team will review it shortly.",
      report,
    });
  } catch (error) {
    console.error("Create Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating report.",
    });
  }
};


export const getMyReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const total = await Report.countDocuments({ reportedBy: req.user._id });
    const reports = await Report.find({ reportedBy: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Get My Reports Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching reports.",
    });
  }
};


export const getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { status, targetType, reason, search } = req.query;

    const filter = {};

    if (status && ["pending", "reviewing", "resolved", "rejected"].includes(status)) {
      filter.status = status;
    }

    if (targetType && ["user", "course", "resource", "unit", "comment", "review"].includes(targetType)) {
      filter.targetType = targetType;
    }

    if (
      reason &&
      [
        "spam",
        "harassment",
        "inappropriate_content",
        "copyright",
        "misinformation",
        "fraud",
        "abuse",
        "other",
      ].includes(reason)
    ) {
      filter.reason = reason;
    }

    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: "i" } },
        { adminNote: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate("reportedBy", "name email role profilePicture")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    console.error("Get All Reports Admin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching admin reports.",
    });
  }
};


export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format.",
      });
    }

    const report = await Report.findById(id)
      .populate("reportedBy", "name email role profilePicture")
      .populate("reviewedBy", "name email");

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

   
    let targetDetails = null;

    if (report.targetType === "user") {
      targetDetails = await User.findById(report.targetId).select("name email role profilePicture isVerified createdAt");
    } else if (report.targetType === "course") {
      targetDetails = await Course.findById(report.targetId)
        .populate("createdBy", "name email role")
        .populate("category", "name");
    } else if (report.targetType === "resource") {
      targetDetails = await Resource.findById(report.targetId)
        .populate("createdBy", "name email role")
        .populate("category", "name");
    } else if (report.targetType === "unit") {
      targetDetails = await Unit.findById(report.targetId).populate("course", "title");
    } else if (report.targetType === "review" || report.targetType === "comment") {
      targetDetails = await Review.findById(report.targetId)
        .populate("user", "name email")
        .populate("course", "title");
    }

    return res.status(200).json({
      success: true,
      report,
      targetDetails,
    });
  } catch (error) {
    console.error("Get Report By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching report details.",
    });
  }
};


export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid report ID format.",
      });
    }

    const allowedStatuses = ["pending", "reviewing", "resolved", "rejected"];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value specified.",
      });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    report.status = status;
    if (adminNote !== undefined) {
      report.adminNote = adminNote.trim();
    }

    if (status === "resolved" || status === "rejected") {
      report.reviewedBy = req.user._id;
      report.reviewedAt = new Date();
    }

    await report.save();

    const updatedReport = await Report.findById(id)
      .populate("reportedBy", "name email role profilePicture")
      .populate("reviewedBy", "name email");

    return res.status(200).json({
      success: true,
      message: `Report status updated to ${status}.`,
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update Report Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating report status.",
    });
  }
};
