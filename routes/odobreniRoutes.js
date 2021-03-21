const express = require('express');


const odobreniControler = require('../controlers/odobreniControler');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router()

    /* router.get('/', odobreniControler.getProjects);
    router.get('/:id', odobreniControler.getProjectById);
    
    router.get('/user/:uid', odobreniControler.getProjectByUserId) */

    router.get('/', odobreniControler.getOdobreni)

    router.use(checkAuth) 
    
    router.post('/', fileUpload.single('slika'),
    odobreniControler.createOdobreni);

   

    router.delete('/:id', odobreniControler.deleteOdobreni) 


module.exports = router