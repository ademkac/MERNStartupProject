const fs = require('fs');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/userModel');
const Message = require('../models/messageModel');

const getMessages = async (req, res, next) => {

    let messages;
    try {
        messages = await Message.find({});
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje poruka iz baze neuspesno', 500
        )
        return next(error)
    }

    res.json({messages: messages.map(p=>p.toObject({getters: true}))})
}

const getMessageByUserId = async (req, res, next) =>{
    const userId = req.params.uid;

    let userWithMessages;
    try {
        userWithMessages = await User.findById(userId).populate('messages');
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje poruka iz baze je neuspesno, molimo vas pokkusajte ponovo',
            500
        );
        return next(error);
    }

    if(!userWithMessages || userWithMessages.messages.length === 0){
        return next(
            new HttpError('Nije moguce pronaci poruke korisnika sa datim id.', 404)
        )
    }

    res.json({
        messages: userWithMessages.messages.map(message=> message.toObject({getters: true}))
    })
}




exports.getMessageByUserId = getMessageByUserId;
exports.getMessages = getMessages;