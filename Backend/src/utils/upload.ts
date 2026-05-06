import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export const uploadStream = (buffer: Buffer): Promise<UploadApiResponse> => {
  return new Promise<UploadApiResponse>((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
      { folder: "Football-Management", resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result as UploadApiResponse);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);

  });
};