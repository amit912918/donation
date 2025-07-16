// middleware/uploadFileMiddleware.ts
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const fileUpload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!, // ✅ No trailing slash
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req: any, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const folder = "newbkp";
      const key = `${folder}/${uniqueName}`;
      cb(null, key);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const isAllowed =
      file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/');
    isAllowed ? cb(null, true) : cb(new Error('Only image and application files are allowed.'));
  },
});

export const uploadFileMiddleware = fileUpload.array('files', 5);
