const express = require('express');

const inboxControler = require('../controlers/inboxConteroler');

const router = express.Router();

    router.get('/user/:uid', inboxControler.getInboxMessages)

module.exports = router;