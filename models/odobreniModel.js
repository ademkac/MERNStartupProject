const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const odobreniSchema = new Schema({
   
     user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
    naslov: {
        type: String,
        required: true
    },
   
    poruka: {
        type: String,
        required: true
    },

   slika: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

const Odobreni = mongoose.model('Odobreni', odobreniSchema);

module.exports = Odobreni;