const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('Autentifikacija neuspesna!')
        }

      const decodedToken=  jwt.verify(token, 'supersecret_dont_share')
      req.userData = {userId: decodedToken.userId}
      next();
    } catch (err) {
        const error = new HttpError(
            'Autentifikacija neuspesna', 403
        )
        return next(error);
    }
    


}