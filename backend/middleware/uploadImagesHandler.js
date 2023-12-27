const multer = require("multer");
const {GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url:process.env.MONGO_CLIENT_CONNECTION,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      return {
        bucketName: "photos",
        filename: `${Date.now()}_${file.originalname}`,
      };
    } else {
      return `${Date.now()}_${file.originalname}`;
    }
  },
});

module.exports=multer({storage})