const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const fundingSchema = new Schema({
   
   naslov: {
       type: String,
       required: true
   },
    text: {
        type: String,
        required: true
    },
    tip: {
        type: String,
        required: true
    },
    podtip: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Funding = mongoose.model('Funding', fundingSchema);

module.exports = Funding;