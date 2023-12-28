const multer = require("multer");
const util = require("util");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: process.env.MONGO_CLIENT_CONNECTION,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const defaultFilename = `${Date.now()}_${file.originalname}`;
    console.log(file)
    if (file && (file.mimetype === "image/jpeg" || file.mimetype === "image/png")) {
      return {
        bucketName: "photos",
        filename: defaultFilename,
      };
    } else {
      return {
        filename: defaultFilename,
      };
    }
  },
});

const uploadFiles = multer({ storage: storage }).single("image");
const uploadFilesMiddleware = util.promisify(uploadFiles);

module.exports = uploadFilesMiddleware;
