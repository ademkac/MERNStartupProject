const express = require('express');
const {check} = require('express-validator');

const projectControler = require('../controlers/projectControler');
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');
const router = express.Router()

    router.get('/', projectControler.getProjects);
    router.get('/:id', projectControler.getProjectById);
    
    router.get('/user/:uid', projectControler.getProjectByUserId)
    

    router.use(checkAuth) 
    
    router.post('/',
    /* fileUpload.single('slika'), */
    projectControler.createProject);

    router.patch(
        '/:id',
        projectControler.updateProject
    )

    router.delete('/:id', projectControler.deleteProject)


module.exports = router