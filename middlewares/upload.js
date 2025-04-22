// middlewares/upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // S3에 직접 올리니까 파일은 메모리에 저장
const upload = multer({ storage });

module.exports = upload;
