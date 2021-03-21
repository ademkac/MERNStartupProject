const express = require('express');


const fundingControlers = require('../controlers/fundingControler');


const router = express.Router();



router.get('/', fundingControlers.getFundings)

router.get('/:id', fundingControlers.getFundingsById)

router.post('/', 
fundingControlers.createfunding); 



module.exports = router;