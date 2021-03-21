const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
   
     user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }, 
   
    link: {
        type: String,
        required: true
    },
   poruka: {
        type: String,
        required: true
    },
    kompanija: {
        type: String,
        required: true
    },
    tip: {
        type: String,
        required: true
    },
    radnoVreme: {
        type: String,
        required: true
    },
    lokacija: {
        type: String,
        required: true
    },
    slika: {
        type: String,
        required: true
    },
    datum:{
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;