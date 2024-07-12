import multer from "multer";
import { v4 as uuidV4 } from "uuid";
import path from "path";
import rootDir from "./root-dir.mjs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(rootDir, "uploads");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, uuidV4() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileType = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileType.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({ storage, fileFilter });
