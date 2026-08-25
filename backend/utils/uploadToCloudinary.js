import streamifier from "streamifier";
import cloudinary from "../configs/cloudinary.js";

const uploadToCloudinary = (fileBuffer, mimetype, originalname) => {
  return new Promise((resolve, reject) => {
   
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let sanitizedName = originalname ? originalname.replace(/[^a-zA-Z0-9.-]/g, "_") : "document";

    const isPdf = mimetype === "application/pdf" || sanitizedName.toLowerCase().endsWith(".pdf");
    if (isPdf && sanitizedName.toLowerCase().endsWith(".pdf")) {
      sanitizedName = sanitizedName.slice(0, -4) + "_pdf";
    }

    const publicId = `${uniqueSuffix}-${sanitizedName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "knowledge-marketplace/resources",
        public_id: publicId,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier
      .createReadStream(fileBuffer)
      .pipe(uploadStream);
  });
};

export default uploadToCloudinary;