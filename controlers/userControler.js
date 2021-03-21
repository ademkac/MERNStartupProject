const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const msgs = require('./email.msgs')
const HttpError = require('../models/http-error');
const User = require('../models/userModel');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer')

dotenv.config()

let transporter = nodemailer.createTransport({
   service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})


const getUsers = async(req,res, next) =>{
   
   let users;
   try {
      users = await User.find({}, '-password');
   } catch (err) {
      const error = new HttpError(
         'Preuzimanje korisnika neuspesno, molimo vas da pokusate kasnije.'
,500)
      return next(error)
   }

   res.json({users: users.map(user=>user.toObject({getters: true}))})

};

const signup = async (req, res, next) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
      throw new HttpError('Invalid inputs passed, please check your data.', 422);
   }

   const { name, email, password} = req.body;

   let existingUser;

try {
   existingUser = await User.findOne({email: email})
} catch (err) {
   const error = new HttpError(
      'Registration failed', 500
   )
   return next(error)
}

  
   let hashedPassword;
   try {
      hashedPassword= await bcrypt.hash(password, 12);
   } catch (err) {
      const error = new HttpError('Nije moguce kreirati korisnika, molimo vas pokusajte opet', 500)
      return next(error)
   }

   const createdUser = new User({
      name,
      email,
      password: hashedPassword,
      jobs: [],
      projects: [],
      cardNumber: [],
      messages: [],
      received: [] 
   })

   let userSaved

  if(!existingUser){
     try {
      userSaved =  await createdUser.save();
      console.log(userSaved)
     } catch (err) {
        const error = new HttpError("Something went wrong", 404)
        return next(error)
     }

     if(userSaved){
        try {
         var mail = {
            from: process.env.EMAIL,
            to: userSaved.email,
            subject: 'Startup Site Confirm Email',
            html: `
            <div>
            <h3>Confirm to us that you are not fake</h3>
            <br>
            <a style='font-size: 16px' href='${process.env.FRONTEND_URL_PRODUCTION}/confirm/${userSaved._id}'>
              click to confirm email
            </a>
            </div>
          `,
          text: `Copy and paste this link: ${process.env.FRONTEND_URL_PRODUCTION}/confirm/${userSaved._id}`
         }
      
         transporter.sendMail(mail, (err, data)=>{
            if(err){
               console.log(err)
               res.json({
                  status: 'fail'
               })
            }else{
               res.json({
                  status: 'success'
               })
            }
         })
          res.json({msg: msgs.confirm})
        } catch (err) {
           const error = new HttpError("Unable to send mail at this time", 500);
           return next(error)
        }
     }
  }else if(existingUser && !existingUser.confirmed){
     try {
      var mail = {
         from: process.env.EMAIL,
         to: existingUser.email,
         subject: 'Startup Site Confirm Email',
         html: `
         <div>
         <h3>Confirm to us that you are not fake</h3>
         <br>
         <a style='font-size: 16px' href='${process.env.FRONTEND_URL_PRODUCTION}/confirm/${existingUser._id}'>
           click to confirm email
         </a>
         </div>
       `,
       text: `Copy and paste this link: ${process.env.FRONTEND_URL_PRODUCTION}/confirm/${existingUser._id}`
      }
   
      transporter.sendMail(mail, (err, data)=>{
         if(err){
            console.log(err)
            res.json({
               status: 'fail'
            })
         }else{
            res.json({
               status: 'success'
            })
         }
      })
        res.json({msg: msgs.resend})
     } catch (err) {
        const error = new HttpError("Unable to send mail", 421)
        return next(error)
     }
   }else if(existingUser){
      const error = new HttpError("User is already registered. Please log in", 409)
      return next(error)
  }else{
      res.json({msg: msgs.alreadyConfirmed})
   }
}

const confirmMail = async(req, res, next) => {
   const {id} = req.params;
   let updatedUser, token, user;

  user = await User.findById(id);
      if(!user){
         const error = new HttpError("Unable to find user");
         return next(error)
      }
      else if(user && !user.confirmed){
         try {
            updatedUser = await User.findByIdAndUpdate(id, {confirmed: true})
         } catch (err) {
            const error = new HttpError("Unable to verify user at this time", 500);
            return next(error)
         }

         if(updatedUser){
            try {
               token = jwt.sign(
                  {userId: user.id,email: user.email},
                     'supersecret_dont_share',
                     {expiresIn: '1h'}
               )
            } catch (err) {
               const error = new HttpError(
                  'Some problem',
                  500
               )
               return next(error);
            }
            res.json({userId: user.id,
               email: user.email,
               isAdmin: user.isAdmin,
               token: token})
         }
      }
      else{
         res.json({msg: msgs.alreadyConfirmed})
      }

}


const login = async(req, res, next) => {
   const{email, password} = req.body;

   let existingUser;

   try {
      existingUser = await User.findOne({email: email})
   } catch (err) {
      const error = new HttpError(
         'Prijava neuspesna, molimo vas pokusajte ponovo kasnije', 500
      )
      return next(error)
   }

   if(!existingUser || !existingUser.confirmed){
      const error = new HttpError(
         'Invalid data, no login possible', 403
      )
      return next(error)
   }

   let isValidPassword = false;
try {
   isValidPassword = await bcrypt.compare(password, existingUser.password)

} catch (err) {
   const error = new HttpError(
      'Nije moguca prijava, molimo vas da proverite vase podatke i pokusajte opet',
      500
   );
   return next(error)
}

   if(!isValidPassword){
      const error = new HttpError(
         'Nevalidni podaci, nije moguca prijava', 403
      )
      return next(error)
   }

   let token;
   try {
     token= jwt.sign(
        {userId: existingUser.id, email: existingUser.email},
         'supersecret_dont_share',
          {expiresIn: '1h'})
   } catch (err) {
      const error = new HttpError(
         'Prijava neuspesna, molimo vas probajte opet kasnije',
         500
      )
      return next(error);
   }

   res.json({
      userId: existingUser.id,
      email: existingUser.email,
      token: token,
      name: existingUser.name
});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.confirmMail = confirmMail;