const express = require('express');

const downloadsControler = require('../controlers/downloadsControler');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

router.post('/', fileUpload.single('image'), downloadsControler.createDownload);
router.get('/', downloadsControler.getDownloads);
router.get('/:id', downloadsControler.getDownloadsById)

module.exports = router;