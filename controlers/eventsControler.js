const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const Event = require('../models/eventModel');


const getEvents = async (req, res, next) => {

    let events;
    try {
        events = await Event.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje dogadjaja iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({events: events.map(p=>p.toObject({getters: true}))})
}


const getEventsById = async (req, res, next) =>{
    const eventId = req.params.id;

    let event;

    try {
        event = await Event.findById(eventId);
    } catch (err) {
        const error = new HttpError(
            'Nesto nije u redu, nije moguce pristupiti detaljima ovog dogadjaja', 500
        )
        return next(error)
    }

    if(!event) {
        const error = new HttpError(
            'Nije moguce pronaci dogadjaj sa datim id-om', 404
        )
        return next(error)
    }

    res.json({event: event.toObject({getters: true})});
}



const createEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const {naslov, opis, datum, lokacija} = req.body;

    
    const createdEvent= new Event({
        naslov,
        opis,
        datum,
        lokacija,
        image: req.file.path
    });


    try {
      
        await createdEvent.save();
    } catch (err) {
        const error = new HttpError(
            'Nije moguce kreirati dogadjaj, molimo vas pokusajte opet', 500
        )
        return next(error);
    }


    res.status(201).json({events: createdEvent});
}




exports.createEvent = createEvent;

exports.getEvents = getEvents;

exports.getEventsById = getEventsById;