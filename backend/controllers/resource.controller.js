import Resource from "../models/resource.model.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import cloudinary from "../configs/cloudinary.js";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import axios from "axios";

export const createResource = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            topics,
            links,
            thumbnail,
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, description and category are required",
            });
        }

        const documents = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer,
                    file.mimetype,
                    file.originalname
                );

                documents.push({
                    name: file.originalname,
                    url: result.secure_url,
                    publicId: result.public_id,
                    mimeType: file.mimetype,
                    resourceType: result.resource_type,
                });
            }
        }

        const resource = await Resource.create({
            title,
            description,
            category,
            topics: topics ? JSON.parse(topics) : [],
            documents,
            links: links ? JSON.parse(links) : [],
            thumbnail,
            createdBy: req.user._id,
            status: req.body.status || "draft",
        });

        return res.status(201).json({
            success: true,
            message: "Resource created successfully",
            resource,
        });
    } catch (error) {
        console.error("Create resource error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create resource",
            error: error.message,
        });
    }
};


export const getMyResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            createdBy: req.user._id,
        })
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        console.error("Get my resources error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch your resources",
            error: error.message,
        });
    }
};


export const updateResource = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            category,
            topics,
            links,
            thumbnail,
            existingDocuments,
        } = req.body;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        // Only owner or admin can update
        if (
            resource.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this resource",
            });
        }

        // Update basic fields
        if (title !== undefined) resource.title = title;
        if (description !== undefined) resource.description = description;
        if (category !== undefined) resource.category = category;
        if (thumbnail !== undefined) resource.thumbnail = thumbnail;
        if (req.body.status !== undefined) resource.status = req.body.status;

        if (topics !== undefined) {
            resource.topics = JSON.parse(topics);
        }

        if (links !== undefined) {
            resource.links = JSON.parse(links);
        }

        // Existing documents that are still kept by the user
        if (existingDocuments !== undefined) {
            const keptDocuments = JSON.parse(existingDocuments);

            const oldDocuments = resource.documents;

            // Delete removed documents from Cloudinary
            for (const oldDocument of oldDocuments) {
                const stillExists = keptDocuments.some(
                    (document) =>
                        document.publicId === oldDocument.publicId
                );

                if (!stillExists && oldDocument.publicId) {
                    try {
                        const rType = oldDocument.resourceType || "raw";
                        await cloudinary.uploader.destroy(
                            oldDocument.publicId,
                            {
                                resource_type: rType,
                            }
                        );
                    } catch (error) {
                        console.error(
                            "Failed to delete old Cloudinary document:",
                            error
                        );
                    }
                }
            }

            resource.documents = keptDocuments;
        }

        // Upload newly added documents
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer,
                    file.mimetype,
                    file.originalname
                );

                resource.documents.push({
                    name: file.originalname,
                    url: result.secure_url,
                    publicId: result.public_id,
                    mimeType: file.mimetype,
                    resourceType: result.resource_type,
                });
            }
        }

        await resource.save();

        return res.status(200).json({
            success: true,
            message: "Resource updated successfully",
            resource,
        });
    } catch (error) {
        console.error("Update resource error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update resource",
            error: error.message,
        });
    }
};

export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }


        if (
            resource.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this resource",
            });
        }

        // Delete all associated documents from Cloudinary first
        if (resource.documents && resource.documents.length > 0) {
            for (const doc of resource.documents) {
                if (doc.publicId) {
                    try {
                        const rType = doc.resourceType || "raw";
                        await cloudinary.uploader.destroy(doc.publicId, {
                            resource_type: rType,
                        });
                    } catch (error) {
                        console.error("Failed to delete Cloudinary asset on resource deletion:", error);
                    }
                }
            }
        }

        await Resource.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Resource deleted successfully",
        });
    } catch (error) {
        console.error("Delete resource error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete resource",
            error: error.message,
        });
    }
};

export const publishResource = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }


        if (
            resource.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to publish this resource",
            });
        }


        if (resource.status === "published") {
            return res.status(400).json({
                success: false,
                message: "Resource is already published",
            });
        }


        if (resource.status === "archived") {
            return res.status(400).json({
                success: false,
                message: "Archived resource cannot be published",
            });
        }

        resource.status = "published";

        await resource.save();

        return res.status(200).json({
            success: true,
            message: "Resource published successfully",
            resource,
        });
    } catch (error) {
        console.error("Publish resource error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to publish resource",
            error: error.message,
        });
    }
};



export const archiveResource = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        // Only owner or admin can archive
        if (
            resource.createdBy.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to archive this resource",
            });
        }

        // already archived resource
        if (resource.status === "archived") {
            return res.status(400).json({
                success: false,
                message: "Resource is already archived",
            });
        }

        resource.status = "archived";

        await resource.save();

        return res.status(200).json({
            success: true,
            message: "Resource archived successfully",
            resource,
        });
    } catch (error) {
        console.error("Archive resource error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to archive resource",
            error: error.message,
        });
    }
};


export const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            status: "published",
        })
            .populate("category", "name")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        console.error("Get resources error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch resources",
            error: error.message,
        });
    }
};

export const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;

        const resource = await Resource.findById(id)
            .populate("category", "name")
            .populate("createdBy", "name");

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found",
            });
        }

        // If resource is not published, only creator or admin can view it
        if (resource.status !== "published") {
            if (
                !req.user ||
                (resource.createdBy._id.toString() !== req.user._id.toString() &&
                    req.user.role !== "admin")
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to view this resource",
                });
            }
        }

        return res.status(200).json({
            success: true,
            resource,
        });
    } catch (error) {
        console.error("Get resource by ID error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch resource",
            error: error.message,
        });
    }
};

export const getAllResourcesAdmin = async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate("category", "name")
            .populate("createdBy", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: resources.length,
            resources,
        });
    } catch (error) {
        console.error("Get all resources admin error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch all resources for admin",
            error: error.message,
        });
    }
};

export const getDocument = async (req, res) => {
    try {
        const { id, docId } = req.params;
        const resource = await Resource.findById(id);

        if (!resource) {
            return res.status(404).json({ success: false, message: "Resource not found" });
        }

        // Access Control for draft/archived resources
        if (resource.status !== "published") {
            // Check for user token manually
            let user = null;
            let token = req.cookies?.token;
            if (!token && req.headers?.authorization) {
                const authHeader = req.headers.authorization;
                if (authHeader.startsWith("Bearer ")) {
                    token = authHeader.split(" ")[1];
                }
            }
            if (token) {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    user = await User.findById(decoded.id);
                } catch (err) {
                    console.error("Token verification failed in document delivery:", err);
                }
            }

            if (!user) {
                return res.status(401).json({ success: false, message: "Authentication required to access private resources" });
            }

            const isOwner = resource.createdBy.toString() === user._id.toString();
            const isAdmin = user.role === "admin";
            if (!isOwner && !isAdmin) {
                return res.status(403).json({ success: false, message: "Access denied" });
            }
        }

        const document = resource.documents.id(docId);
        if (!document) {
            return res.status(404).json({ success: false, message: "Document not found" });
        }

        // Fetch file from Cloudinary and stream it back with custom headers
        const cloudinaryResponse = await axios({
            method: "get",
            url: document.url,
            responseType: "stream",
        });

        res.setHeader("Content-Type", document.mimeType || "application/octet-stream");

        const isPdf = (document.mimeType && document.mimeType === "application/pdf") || document.name.toLowerCase().endsWith(".pdf");
        if (isPdf) {
            res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(document.name)}"`);
        } else {
            res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(document.name)}"`);
        }

        cloudinaryResponse.data.pipe(res);
    } catch (error) {
        console.error("Document delivery error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to download document",
            error: error.message,
        });
    }
};