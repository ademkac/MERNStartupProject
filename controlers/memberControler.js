const mongoose = require('mongoose');
const {validationResult} = require('express-validator')
const HttpError = require('../models/http-error');
const Member = require('../models/memberModel');
const User = require('../models/userModel');


const createMember = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return next(new HttpError(
            'Nisu uneti validne vrednosti, molimo vas da ispravite gresku', 422
        ))
    }

    const { name, email} = req.body;

    const createdMember = new Member({
        name,
        email
    });


    try {
        await createdMember.save();
    } catch (err) {
        const error = new HttpError(
            'Neka greska, molimo vas pokusajte opet', 500
        )
        return next(error);
    }

    res.status(201).json({member: createdMember})
}

const getMembers = async(req, res, next) => {
    let members;
    try {
        members = await Member.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje clanova iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({ members: members.map(m=>m.toObject({getters: true}))})
}

exports.createMember = createMember;
exports.getMembers = getMembers;