import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

// Define allowed MIME types
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

const upload = multer().array('productImages[]', 5); // No need to specify storage or fileFilter here as we're handling base64

const getProductImg = asyncHandler(async (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (likely due to file type validation)
      return res.status(400).json(new ApiError(400, [], err.message));
    } else if (err) {
      // An unknown error occurred
      return res.status(500).json(new ApiError(500, [], 'Internal server error'));
    }


    const { productImages } = req.body;

    if (!productImages || productImages.length === 0) {
      // No images provided in the request body
      return res.status(400).json(new ApiError(400, [], 'Image is required'));
    }

    const uploadedFiles = [];

    // Process base64 images
    for (const base64String of productImages) {
      const matches = base64String.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
      if (!matches || matches.length !== 3 || !allowedMimeTypes.includes(`image/${matches[1]}`)) {
        return res.status(400).json(new ApiError(400, [], 'Only JPG and PNG files are allowed!'));
      }

      const ext = matches[1];
      const base64Data = matches[2];
      const filename = `product-Image-${uuidv4()}.${ext}`;
      const filePath = path.join('public', 'storage', 'productImages', filename);

      try {
        // Decode and save the base64 image
        fs.writeFileSync(filePath, base64Data, 'base64');
        uploadedFiles.push({ filename, path: filePath });
      } catch (error) {
        console.error('Error saving base64 image:', error);
        return res.status(500).json(new ApiError(500, [], 'Error saving image'));
      }
    }

    console.log('Uploaded files:', uploadedFiles);

    req.productImg = uploadedFiles


    next(); // Call next middleware
  });
});

export { getProductImg };
