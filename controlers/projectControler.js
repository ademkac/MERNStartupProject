const fs = require('fs');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/userModel');
const Project = require('../models/projectModel');

const getProjects = async (req, res, next) => {

    let projects;
    try {
        projects = await Project.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje projekata iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({projects: projects.map(p=>p.toObject({getters: true}))})
}

const getProjectById = async (req, res, next) => {
    const projectId = req.params.id;

    let project;
    
    try {
        project = await Project.findById(projectId);
    } catch (err) {
        const error = new HttpError('Nesto nije u redu, ne mozemo pronaci projekat.', 500);
        return next(error);
    }

    if(!project) {
        const error= new HttpError('Nije moguce pronaci projekat sa datim id', 404);
        return next(error);
    }

    res.json({project: project.toObject({getters: true}) });
}


const getProjectByUserId = async (req, res, next) =>{
    const userId = req.params.uid;

    let userWithProjects;
    try {
        userWithProjects = await User.findById(userId).populate('projects');
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje projekata iz baze je neuspesno, molimo vas pokkusajte ponovo',
            500
        );
        return next(error);
    }

    if(!userWithProjects || userWithProjects.projects.length === 0){
        return next(
            new HttpError('You currently have no projects yet', 404)
        )
    }

    res.json({
        projects: userWithProjects.projects.map(project=> project.toObject({getters: true}))
    })
}

const createProject = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const {poruka, user, naslov, mail, slika} = req.body;
    
    const createdProject= new Project({
        user: user/* req.userData.userId */,
        naslov,
        poruka,
        slika,
        mail,
        
    });

    let userr;
    try {
        userr = await User.findById(user);
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati projekat, molimo vas probajte opet', 500
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
        /* const sess = await mongoose.startSession();
        sess.startTransaction() */
        await createdProject.save();
        userr.projects.push(createdProject);
        await userr.save();
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati projekat, molimo vas pokusajte opet', 500
        )
        return next(error);
    }


    res.status(201).json({project: createdProject});
}

const updateProject = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next( new HttpError('Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422));
    }

    const projectId = req.params.id;
    const {poruka, naslov, mail} = req.body;


    let project;
    try {
        project = await Project.findById(projectId)
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izmeniti projekat', 500
        )
        return next(error);
    }

    project.poruka = poruka;
    project.naslov = naslov;
    project.mail = mail

    try {
        await project.save();
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izmeniti projekat', 500
        )
        return next(error);
    }

    res.status(200).json({project: project.toObject({getters: true})});
}


const deleteProject = async(req, res, next) => {
    const projectId = req.params.id;
    
    let project;
    try {
        project = await Project.findById(projectId).populate('user');

    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izbrisati projekat', 500
        )
        return next(error)
    }

    if(!project){
        const error = new HttpError(
            'Nije moguce pronaci projekat sa datim id.', 404
        )
        return next(error);
    }

    const imagePath = project.slika;

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await project.remove({session: sess});
        project.user.projects.pull(project);
        await project.user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce izbrisati project', 500
        )
        return next(error)
    }

    fs.unlink(imagePath, err => {
        console.log(err)
    });
    
    res.status(200).json({message: 'Deleted project. '});
}

exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.deleteProject = deleteProject;
exports.updateProject = updateProject;
exports.getProjectByUserId = getProjectByUserId;
exports.getProjects = getProjects;