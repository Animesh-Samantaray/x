import Unit from "../models/Unit.model.js";
import Course from "../models/Course.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../configs/cloudinary.js";


const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error(`Failed to delete Cloudinary asset ${publicId}:`, err);
  }
};

export const createUnit = async (req, res) => {
    try {
        const {
            title,
            description,
            course,
            attachments,
        } = req.body;

        if (!title || !course) {
            return res.status(400).json({
                success: false,
                message: "Title and course are required",
            });
        }

        const courseDoc = await Course.findById(course);

        if (!courseDoc) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        
        if (
            req.user.role !== "admin" &&
            courseDoc.createdBy.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to create a unit in this course",
            });
        }

       
        const lastUnit = await Unit.findOne({ course }).sort({ order: -1 });
        const order = lastUnit ? lastUnit.order + 1 : 1;

        const unitAttachments = [];

     
        if (attachments) {
            const parsedAttachments =
                typeof attachments === "string"
                    ? JSON.parse(attachments)
                    : attachments;

            if (Array.isArray(parsedAttachments)) {
                unitAttachments.push(...parsedAttachments);
            }
        }

       
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer,
                    file.mimetype,
                    file.originalname
                );

                let type = "other";

                if (file.mimetype.startsWith("video/")) {
                    type = "video";
                } else if (file.mimetype.startsWith("image/")) {
                    type = "image";
                } else if (
                    file.mimetype === "application/pdf" ||
                    file.mimetype.includes("word") ||
                    file.mimetype.includes("excel") ||
                    file.mimetype.includes("powerpoint") ||
                    file.mimetype === "text/plain"
                ) {
                    type = "document";
                }

                unitAttachments.push({
                    title: file.originalname,
                    url: result.secure_url,
                    type,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                });
            }
        }

        const unit = await Unit.create({
            title,
            description,
            course,
            order,
            attachments: unitAttachments,
        });

   
        courseDoc.units.push(unit._id);
        await courseDoc.save();

        return res.status(201).json({
            success: true,
            message: "Unit created successfully",
            unit,
        });
    } catch (error) {
        console.error("Create unit error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create unit",
            error: error.message,
        });
    }
};


export const getUnitsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

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
                message: "You are not authorized to access this course",
            });
        }

        const units = await Unit.find({
            course: courseId,
        }).sort({ order: 1 });

        return res.status(200).json({
            success: true,
            count: units.length,
            units,
        });
    } catch (error) {
        console.error("Get units by course error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch course units",
            error: error.message,
        });
    }
};


export const getUnitById = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findById(id).populate(
            "course",
            "title description createdBy enrolledStudents"
        );

        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }

        const course = unit.course;
        const isAdmin = req.user.role === "admin";
        const isOwner = course.createdBy.toString() === req.user._id.toString();

        let isEnrolled = false;
        for (const studentId of course.enrolledStudents || []) {
            if (studentId.toString() === req.user._id.toString()) {
                isEnrolled = true;
                break;
            }
        }

        if (!isAdmin && !isOwner && !isEnrolled) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this unit",
            });
        }

        return res.status(200).json({
            success: true,
            unit,
        });
    } catch (error) {
        console.error("Get unit by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch unit",
            error: error.message,
        });
    }
};


export const updateUnit = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            attachments,
            removeAttachments,
        } = req.body;

        const unit = await Unit.findById(id);

        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }

        const course = await Course.findById(unit.course);

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
                message: "You are not authorized to update this unit",
            });
        }

      
        if (title !== undefined) {
            unit.title = title;
        }

        if (description !== undefined) {
            unit.description = description;
        }

        
        if (removeAttachments) {
            const attachmentsToRemove =
                typeof removeAttachments === "string"
                    ? JSON.parse(removeAttachments)
                    : removeAttachments;

            if (Array.isArray(attachmentsToRemove)) {
                for (const attId of attachmentsToRemove) {
                    const targetAtt = unit.attachments.find(
                        (a) => a._id.toString() === attId.toString()
                    );
                    if (targetAtt && targetAtt.publicId) {
                        await deleteFromCloudinary(targetAtt.publicId, targetAtt.resourceType || "raw");
                    }
                }

                unit.attachments = unit.attachments.filter(
                    (attachment) =>
                        !attachmentsToRemove.includes(attachment._id.toString())
                );
            }
        }

      
        if (attachments) {
            const parsedAttachments =
                typeof attachments === "string"
                    ? JSON.parse(attachments)
                    : attachments;

            if (Array.isArray(parsedAttachments)) {
                unit.attachments.push(...parsedAttachments);
            }
        }

        
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer,
                    file.mimetype,
                    file.originalname
                );

                let type = "other";

                if (file.mimetype.startsWith("video/")) {
                    type = "video";
                } else if (file.mimetype.startsWith("image/")) {
                    type = "image";
                } else if (
                    file.mimetype === "application/pdf" ||
                    file.mimetype.includes("word") ||
                    file.mimetype.includes("excel") ||
                    file.mimetype.includes("powerpoint") ||
                    file.mimetype === "text/plain"
                ) {
                    type = "document";
                }

                unit.attachments.push({
                    title: file.originalname,
                    url: result.secure_url,
                    type,
                    publicId: result.public_id,
                    resourceType: result.resource_type,
                });
            }
        }

        await unit.save();

        return res.status(200).json({
            success: true,
            message: "Unit updated successfully",
            unit,
        });
    } catch (error) {
        console.error("Update unit error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update unit",
            error: error.message,
        });
    }
};


export const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        const unit = await Unit.findById(id);

        if (!unit) {
            return res.status(404).json({
                success: false,
                message: "Unit not found",
            });
        }

        const course = await Course.findById(unit.course);

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
                message: "You are not authorized to delete this unit",
            });
        }

      
        course.units = course.units.filter(
            (unitId) => unitId.toString() !== unit._id.toString()
        );
        await course.save();

        
        if (unit.attachments && unit.attachments.length > 0) {
            for (const att of unit.attachments) {
                if (att.publicId) {
                    await deleteFromCloudinary(att.publicId, att.resourceType || "raw");
                }
            }
        }

      
        await Unit.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Unit deleted successfully",
        });
    } catch (error) {
        console.error("Delete unit error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete unit",
            error: error.message,
        });
    }
};