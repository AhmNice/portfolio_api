import { CloudinaryUploadSignature } from "@/interface/cloudinary.interface.js";
import cloudinaryService from "@/service/cloudinary.service.js";

interface SignatureOptions {
  folder: string;
  publicId?: string;
  resourceType: "image" | "raw" | "video" | "auto";
}

 class Upload {
  async generateSignature(options: SignatureOptions):Promise<CloudinaryUploadSignature> {
    return await cloudinaryService.generateUploadSignature({
      folder: options.folder,
      publicId: options.publicId,
      resourceType: options.resourceType,
    });
  }
}
export const uploadService = new Upload();