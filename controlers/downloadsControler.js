const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Download = require('../models/downloadsModel')

const getDownloads = async (req, res, next) => {

    let downloads;
    try {
        downloads = await Download.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje kurseva iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({downloads: downloads.map(p=>p.toObject({getters: true}))})
}


const getDownloadsById = async (req, res, next) =>{
    const eventId = req.params.id;

    let download;

    try {
        download = await Download.findById(eventId);
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce pristupiti detaljima ovog kursa', 500
        )
        return next(error)
    }

    if(!download) {
        const error = new HttpError(
            'Nije moguce pronaci kurs sa datim id-om', 404
        )
        return next(error)
    }

    res.json({download: download.toObject({getters: true})});
}



const createDownload = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const {naslov, opis, zahtevi, link} = req.body;

    
    const createdDownload= new Download({
        naslov,
        opis,
        zahtevi,
        link,
        image: req.file.path
    });


    try {
      
        await createdDownload.save();
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati kurs, molimo vas pokusajte opet', 500
        )
        return next(error);
    }


    res.status(201).json({downloads: createdDownload});
}




exports.createDownload = createDownload;

exports.getDownloads = getDownloads;

exports.getDownloadsById = getDownloadsById;