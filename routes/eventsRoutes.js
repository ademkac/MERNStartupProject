const express = require('express');
const fileUpload = require('../middleware/file-upload');


const eventControler = require('../controlers/eventsControler');


const router = express.Router();



router.get('/', eventControler.getEvents)

router.get('/:id', eventControler.getEventsById)

router.post('/', fileUpload.single('image') ,
eventControler.createEvent); 



module.exports = router;