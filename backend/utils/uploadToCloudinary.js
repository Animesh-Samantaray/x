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

      // Images
      if (mimetype?.startsWith("image/")) {
        resourceType = "image";
      }

      // Videos
      else if (mimetype?.startsWith("video/")) {
        resourceType = "video";
      }

      const publicId = `${uniqueSuffix}-${sanitizedName}`;

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