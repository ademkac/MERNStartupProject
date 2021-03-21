 const fs = require('fs')
 const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/userModel');
const Job = require('../models/jobModel');


const getJobs = async (req, res, next) => {

    let jobs;
    try {
        jobs = await Job.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje poslova iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({jobs: jobs.map(p=>p.toObject({getters: true}))})
}

const getJobById = async (req, res, next) => {
    const jobId = req.params.id;

    let job;
    
    try {
        job = await Job.findById(jobId);
    } catch (err) {
        const error = new HttpError('Nesto nije u redu, ne mozemo pronaci posao.', 500);
        return next(error);
    }

    if(!job) {
        const error= new HttpError('Nije moguce pronaci posao sa datim id', 404);
        return next(error);
    }

    res.json({job: job.toObject({getters: true}) });
}


const getJobByUserId = async (req, res, next) =>{
    const userId = req.params.uid;

    let userWithJobs;
    try {
        userWithJobs = await User.findById(userId).populate('jobs');
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje poslova iz baze je neuspesno, molimo vas pokkusajte ponovo',
            500
        );
        return next(error);
    }

    if(!userWithJobs || userWithJobs.jobs.length === 0){
        return next(
            new HttpError('Nije moguce pronaci poslove sa datim id.', 404)
        )
    }

    res.json({
        jobs: userWithJobs.jobs.map(job=> job.toObject({getters: true}))
    })
}

const createJob = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const {
        user,
        link,
        poruka,
        kompanija,
        tip,
        radnoVreme,
        lokacija,
        datum,
    slika} = req.body;
    
    const createdJob= new Job({
        user,
        link,
        poruka,
        kompanija,
        tip,
        radnoVreme,
        lokacija,
        slika,
        datum
    });

    let userr;
    try {
        userr = await User.findById(user);
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati posao, molimo vas probajte opet', 500
        )
        return next(error);
    }

    if(!userr){
        const error = new HttpError(
            'Nije moguce pronaci korisnika sa datim id.', 404
        )
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdJob.save({session: sess});
        userr.jobs.push(createdJob);
        await userr.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati posao, molimo vas pokusajte opet', 500
        )
        return next(error);
    }


    res.status(201).json({job: createdJob});
}

const updateJob = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next( new HttpError('Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422));
    }

    const jobId = req.params.id;
    const {link, file, poruka, cardNumber} = req.body;

   /*  const updatedJob = {...DUMMY_JOBS.find(j=>j.id === jobId)};
    const jobIndex = DUMMY_JOBS.findIndex(j=>j.id === jobId);
    updatedJob.link = link;
    updatedJob.user = user;
    updatedJob.file = file;
    updatedJob.cardNumber = cardNumber;

    DUMMY_JOBS[jobIndex] = updatedJob; */

    let job;
    try {
        job = await Job.findById(jobId)
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izmeniti posao', 500
        )
        return next(error);
    }

    job.link = link;
    job.file = file;
    job.poruka = poruka;
    job.cardNumber = cardNumber;

    try {
        await job.save();
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izmeniti posao', 500
        )
        return next(error);
    }

    res.status(200).json({job: job.toObject({getters: true})});
}


const deleteJob = async(req, res, next) => {
    const jobId = req.params.id;
    
    let job;
    try {
        job = await Job.findById(jobId).populate('user');

    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izbrisati posao', 500
        )
        return next(error)
    }

    if(!job){
        const error = new HttpError(
            'Nije moguce pronaci posao sa datim id.', 404
        )
        return next(error);
    }

    const imagePath = job.slika;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await job.remove({session: sess});
        job.user.jobs.pull(job);
        await job.user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izbrisati posao', 500
        )
        return next(error)
    }

    fs.unlink(imagePath, err=>{
        console.log(err)
    })
    
    res.status(200).json({message: 'Deleted job. '});
}

exports.getJobById = getJobById;
exports.createJob = createJob;
exports.deleteJob = deleteJob;
exports.updateJob = updateJob;
exports.getJobByUserId = getJobByUserId;
exports.getJobs = getJobs;