const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadCSV } = require("../controllers/uploadController");

const upload = multer();

router.post("/upload", upload.single("file"), uploadCSV);

module.exports = router;
