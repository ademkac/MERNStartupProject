const express = require('express');

const contactControler = require('../controlers/contactControler');

const router = express.Router();

router.post('/', contactControler.sendMailToMe);


module.exports = router;