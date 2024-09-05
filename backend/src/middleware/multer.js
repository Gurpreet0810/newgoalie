import multer from "multer";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import express from 'express';

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join('public', 'storage', 'productImages');
        fs.mkdirSync(uploadPath, { recursive: true }); // Create directory if it doesn't exist
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        cb(null, `product-Image-${uniqueSuffix}.${file.originalname}`); // Use a unique file name
    }
});

// File filter to validate MIME types
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError('Invalid file type', 400), false);
    }
};

// Initialize multer without using it directly
const upload = multer({ storage: storage, fileFilter: fileFilter });

const getProductImg = asyncHandler(async (req, res, next) => {
    // Use multer's single method within the middleware
    upload.single('goalie_photo')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors (e.g., file size limit exceeded)
            return next(new ApiError(err.message, 400));
        } else if (err) {
            // Handle other errors
            return next(new ApiError(err.message, 500));
        }

        if (!req.file) {
            // If no file was uploaded, handle accordingly
            req.image = null; // Set image to null if no new image is provided
          } else {
            // Save the filename to req.image
            req.image = req.file.filename;
          }

        // At this point, multer has parsed the file and req.file should be populated
        console.log(req.file); // Output file details if correctly uploaded
        
        // Save the filename to req.image
        // req.image = req.file.filename;

        // Continue to the next middleware or route handler
        next();
    });
});

const getImg = asyncHandler(async (req, res, next) => {
    // Use multer's single method within the middleware
    upload.single('photo')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle Multer errors (e.g., file size limit exceeded)
            return next(new ApiError(err.message, 400));
        } else if (err) {
            // Handle other errors
            return next(new ApiError(err.message, 500));
        }

        if (!req.file) {
            // If no file was uploaded, handle accordingly
            req.image = null; // Set image to null if no new image is provided
          } else {
            // Save the filename to req.image
            req.image = req.file.filename;
          }

        // At this point, multer has parsed the file and req.file should be populated
        console.log(req.file); // Output file details if correctly uploaded
        
        // Save the filename to req.image
        // req.image = req.file.filename;

        // Continue to the next middleware or route handler
        next();
    });
});

export { getProductImg, getImg };
