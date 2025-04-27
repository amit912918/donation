import multer from "multer";
import path from "path";

const uploadDirectory = path.resolve(__dirname, "../../../../assets/thumbnail");

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploadVideo = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: function (_req, file, cb) {
        if (file.mimetype.startsWith("video/")) {
            cb(null, true);
        } else {
            cb(new Error("Only video files are allowed"));
        }
    },
});

export default uploadVideo;