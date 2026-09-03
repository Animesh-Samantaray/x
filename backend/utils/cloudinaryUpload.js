import streamifier from "streamifier";
import cloudinary from "../configs/cloudinary.js";

export const uploadToCloudinary = (file, mimetypeOverride, originalnameOverride) => {
  return new Promise((resolve, reject) => {
    try {
      const fileBuffer = file?.buffer || file;
      const mimetype = file?.mimetype || mimetypeOverride;
      const originalname = file?.originalname || originalnameOverride || "file";

      if (!fileBuffer) {
        return reject(new Error("No file buffer provided for Cloudinary upload."));
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

      const sanitizedName = originalname
        ? originalname.replace(/[^a-zA-Z0-9.-]/g, "_")
        : "file";

      let resourceType = "raw";

      if (mimetype?.startsWith("image/")) {
        resourceType = "image";
      } else if (mimetype?.startsWith("video/")) {
        resourceType = "video";
      }

      const extensionIndex = sanitizedName.lastIndexOf(".");
      const fileNameWithoutExtension =
        extensionIndex > 0
          ? sanitizedName.substring(0, extensionIndex)
          : sanitizedName;

      const publicId = `${uniqueSuffix}-${fileNameWithoutExtension}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder: "knowledge-marketplace/attachments",
          public_id: publicId,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return reject(error);
          }

          resolve(result);
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    } catch (error) {
      reject(error);
    }
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = "image") => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
};
