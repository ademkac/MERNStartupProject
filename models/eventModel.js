const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
   
   naslov: {
       type: String,
       required: true
   },
    opis: {
        type: String,
        required: true
    },
    datum: {
        type: String,
        required: true
    },
    lokacija: {
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

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;