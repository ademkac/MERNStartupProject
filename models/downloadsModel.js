const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const downloadsSchema = new Schema({
   
   naslov: {
       type: String,
       required: true
   },
    opis: {
        type: String,
        required: true
    },
    zahtevi: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Download = mongoose.model('Download', downloadsSchema);

module.exports = Download;