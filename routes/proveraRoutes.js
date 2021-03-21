const express = require('express');


const proveraControler = require('../controlers/proveraControler');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router()

    /* router.get('/', proveraControler.getProjects);
    router.get('/:id', proveraControler.getProjectById);
    
    router.get('/user/:uid', proveraControler.getProjectByUserId) */

    router.get('/', proveraControler.getOdobreni)

    router.use(checkAuth) 
    
    router.post('/', fileUpload.single('slika'),
    proveraControler.createOdobreni);

   

    router.delete('/:id', proveraControler.deleteOdobreni) 


module.exports = router