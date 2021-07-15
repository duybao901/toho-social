const express = require('express');
const router = express.Router();

const UploadController = require('../Controller/upload.controller');
const upload = require('../Middleware/upload')

router.post('/upload_image_uncheck', UploadController.uploadImage);
router.post('/upload_image', upload, UploadController.uploadImage);
router.post('/delete_image',  UploadController.destroyImage);

module.exports = router;