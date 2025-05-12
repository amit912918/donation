import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req.body, "type", file);
    const uploadDirectory = path.resolve(__dirname, `../../../../assets/${req.body.type}`);

    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (JPEG, PNG, GIF) are allowed."));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

// Middleware for uploading multiple images
const uploadImagesMiddleware = upload.array("images", 5);

export default uploadImagesMiddleware;