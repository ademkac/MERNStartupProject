const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Funding = require('../models/fundingModel');

const getFundings = async (req, res, next) => {

    let fundings;
    try {
        fundings = await Funding.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje dogadjaja iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({fundings: fundings.map(p=>p.toObject({getters: true}))})
}


const getFundingsById = async (req, res, next) =>{
    const fundingId = req.params.id;

    let funding;

    try {
        funding = await Funding.findById(fundingId);
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce pristupiti detaljima ovog dogadjaja', 500
        )
        return next(error)
    }

    if(!funding) {
        const error = new HttpError(
            'Nije moguce pronaci dogadjaj sa datim id-om', 404
        )
        return next(error)
    }

    res.json({funding: funding.toObject({getters: true})});
}



const createfunding = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const {naslov, text, tip, podtip, link} = req.body;

    
    const createdfunding= new Funding({
        naslov,
        text,
        tip,
        podtip,
        link
    });


    try {
      
        await createdfunding.save();
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati dogadjaj, molimo vas pokusajte opet', 500
        )
        return next(error);
    }


    res.status(201).json({fundings: createdfunding});
}




exports.createfunding = createfunding;

exports.getFundings = getFundings;

exports.getFundingsById = getFundingsById;