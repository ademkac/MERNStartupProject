const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const memberSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }
})

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;