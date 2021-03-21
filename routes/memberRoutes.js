const express = require('express');

const memberControler = require('../controlers/memberControler');
const router = express.Router()

router.get('/', memberControler.getMembers )


router.post('/', memberControler.createMember)



module.exports = router;