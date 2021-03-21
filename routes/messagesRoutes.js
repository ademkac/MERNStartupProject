const express = require('express');

const messagesControler = require('../controlers/messagesControler');

const router = express.Router();

    router.get('/', messagesControler.getMessages);
    router.get('/user/:uid', messagesControler.getMessageByUserId)

module.exports = router;