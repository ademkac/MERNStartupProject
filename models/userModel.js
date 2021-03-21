const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    cardNumber: [{
        type: String,
        required: true,
        default: []
    }],
    jobs: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Job' }],
    projects: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Project' }],
    messages: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Message' }],
    received: [{type: mongoose.Types.ObjectId, required: true, ref: 'Message'}]

}, {
    timestamps: true
})

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User', userSchema);

module.exports = User;