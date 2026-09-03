import streamifier from "streamifier";
import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = (fileBuffer, mimetype, originalname) => {
  return new Promise((resolve, reject) => {
    try {
      const uniqueSuffix =
        Date.now() + "-" + Math.round(Math.random() * 1e9);

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

      streamifier
        .createReadStream(fileBuffer)
        .pipe(uploadStream);
    } catch (error) {
      reject(error);
    }
  });
};

export default uploadToCloudinary;