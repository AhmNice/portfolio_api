import fs from "fs/promises";
import {
  CloudinaryUploadOptions,
  CloudinaryUploadResult,
  CloudinaryUploadSignature,
} from "@/interface/cloudinary.interface.js";
import cloudinary from "@/config/cloudinary.js";
import config from "@/config/config.js";
import { ApiError } from "@/util/errorHandler.js";


export interface ICloudinaryService {
  generateUploadSignature(
    options: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadSignature>;
  upload(
    filePath: string,
    options?: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult>;
  uploadMany(
    filePaths: string[],
    options?: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult[]>;
}

export class CloudinaryService implements ICloudinaryService {
  async generateUploadSignature(
    options: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadSignature> {
    try {
      if (!options?.folder) {
        throw new ApiError(400, "Upload folder path is required");
      }

      if (!config.CLOUDINARY_SECRET_KEY || !config.CLOUDINARY_API_KEY) {
        throw new ApiError(500, "Cloudinary credentials are not configured");
      }

      const timestamp = Math.floor(Date.now() / 1000);

      const paramsToSign: Record<string, string | number> = {
        folder: options.folder,
        timestamp,
      };

      if (options.publicId) {
        paramsToSign.public_id = options.publicId;
      }

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        config.CLOUDINARY_SECRET_KEY,
      );

      return {
        api_key: config.CLOUDINARY_API_KEY,
        cloudName: config.CLOUD_NAME,
        signature,
        timestamp,
        folder: options.folder,
        publicId: options.publicId,
        resourceType: options.resourceType ?? "image",
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        500,
        `Failed to generate upload signature: ${(error as Error).message}`,
      );
    }
  }


  async upload(
    filePath: string,
    options?: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult> {
    if (!filePath) {
      throw new ApiError(400, "File path is required for upload");
    }

    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: options?.folder,
        public_id: options?.publicId,
        resource_type: options?.resourceType || "image",
      });

      return {
        publicId: result.public_id,
        secureUrl: result.secure_url,
        resourceType: result.resource_type || options?.resourceType || "image",
      };
    } catch (error) {
      throw new ApiError(
        500,
        `Cloudinary upload failed: ${(error as Error).message}`,
      );
    } finally {
      await fs.unlink(filePath).catch(() => null);
    }
  }
  async uploadMany(
    filePaths: string[],
    options?: CloudinaryUploadOptions,
  ): Promise<CloudinaryUploadResult[]> {
    if (!filePaths || filePaths.length === 0) {
      throw new ApiError(400, "At least one file path must be provided");
    }

    const results = await Promise.allSettled(
      filePaths.map((filePath) => this.upload(filePath, options)),
    );

    const successfulUploads: CloudinaryUploadResult[] = [];
    const errors: string[] = [];

    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        successfulUploads.push(result.value);
      } else {
        errors.push(`File ${idx + 1}: ${result.reason.message}`);
      }
    });

    if (errors.length > 0 && successfulUploads.length === 0) {
      throw new ApiError(
        500,
        `All batch uploads failed:\n${errors.join("\n")}`,
      );
    }

    return successfulUploads;
  }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;