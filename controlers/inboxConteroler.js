
const HttpError = require('../models/http-error');
const User = require('../models/userModel');



const getInboxMessages = async (req, res, next) =>{
    const userId = req.params.uid;

    let userWithMessages;
    try {
        userWithMessages = await User.findById(userId).populate('received');
    } catch (err) {
        const error = new HttpError(
            'Preuzimanje poruka iz baze je neuspesno, molimo vas pokkusajte ponovo',
            500
        );
        return next(error);
    }

    if(!userWithMessages || userWithMessages.received.length === 0){
        return next(
            new HttpError('You currently have no messages in your inbox.', 404)
        )
    }

    res.json({
        messages: userWithMessages.received.map(message=> message.toObject({getters: true}))
    })
}




exports.getInboxMessages = getInboxMessages;
