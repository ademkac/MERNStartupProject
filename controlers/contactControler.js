const nodemailer = require('nodemailer');
const dotenv = require('dotenv');


dotenv.config();

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


const sendMailToMe = (req, res, next) => {
    var name = req.body.name
    var email = req.body.email
    var poruka = req.body.poruka
    var content = `name: ${name} \n email: ${email} \n poruka: ${poruka}`

    var mail = {
        from: process.env.EMAIL,
        to: 'ademkacapor3@gmail.com',
        subject: 'Nova poruka sa startup sajta',
        text: content 
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
            });
        };

        
    })
}



exports.sendMailToMe = sendMailToMe;