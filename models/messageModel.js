const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
    user:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    room: {
        type: String,
        required: true
    },
    text: {
        type: String, 
        required: true
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;