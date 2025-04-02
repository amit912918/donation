import multer from "multer";
import path from "path";

// Define the upload directory
const uploadDirectory = path.resolve(__dirname, "../../../../assets/thumbnail");

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDirectory); // Store videos in this folder
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

// Multer Upload Middleware
const uploadVideo = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB Limit
    fileFilter: function (_req, file, cb) {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed"));
        }
    },
});

export default uploadVideo;