import { Request, Response } from "express";
import { asyncHandler } from "@/lib/asyncHandler.js";
import { uploadService } from "@/service/upload.service.js";
import { ApiResponse } from "@/util/api.js";
class UploadController {
  readonly generateSignature = asyncHandler(
    async (req: Request, res: Response) => {
      const { folder, publicId, resourceType } = req.body;
      console.log("Request body:", req.body); // Log the request body for debugging
      const signature = await uploadService.generateSignature({
        folder,
        publicId,
        resourceType,
      });
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Upload signature generated successfully",
            signature,
          ),
        );
    },
  );
}

export const uploadController = new UploadController();
