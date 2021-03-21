const express = require('express');

const jobController = require('../controlers/jobControler');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();

router.get('/:id', jobController.getJobById);

router.get('/', jobController.getJobs)

router.use(checkAuth);

router.post('/', /* fileUpload.single('slika'), */
jobController.createJob
); 

router.get('/user/:uid', jobController.getJobByUserId);

router.patch('/:id',
jobController.updateJob);

router.delete('/:id', jobController.deleteJob);


/* router.route('/:id').get(getProjectById) */

module.exports = router;