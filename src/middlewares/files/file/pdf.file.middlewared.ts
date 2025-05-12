import multer from 'multer';
import path from 'path';
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = path.resolve(__dirname, `../../../../assets/${req.body.type}`);

        if (!fs.existsSync(uploadDirectory)) {
            fs.mkdirSync(uploadDirectory, { recursive: true });
        }
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/')) {
        cb(null, true);
    } else {
        cb(new Error('Only images and files are allowed!'));
    }
};

const multerInstance = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

// export const uploadFileMiddleware = multerInstance.single('file');
export const uploadFileMiddleware = multerInstance.array('files', 5);
