const express = require('express');
const paypal = require('paypal-rest-sdk')
const dotenv = require('dotenv');
const router = express.Router();


dotenv.config()
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.PAYPAL_CLIENT_ID,
    'client_secret': process.env.PAYPAL_CLIENT_SECRET
  });

router.post('/', (req, res)=>{
    const create_payment_json = {
        "auth": {
            "user": "AX8F9kBNgjvYAfDj1vdthxWIGd3Ol4fl-uEb1yWvMKmgGNlo-wm-YwGbrluRLMjHPfaqoM3YwsxJj2L4",
            "pass": "EF5tMtb5xin-Lf_PbAjTfcCuFs0TIJEKS1lXvZ7VEkGXGnJMJvxQ4jSfe_EHlQA0zSwYqQZPLWvNcdfT"
        },
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://localhost:5000/api/pay/success`,
            "cancel_url": `http://localhost:5000/api/pay/cancel`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "member",
                    "sku": "001",
                    "price": "99.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "99.00"
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
           for(let i = 0; i< payment.links.length; i++){
               if(payment.links[i].rel === 'approval_url'){
                   res.redirect(payment.links[i].href);
               }
           }
        }
    });
})

router.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "99.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('success')
        }
    });
})

router.get('/cancel', (req, res)=>{
    res.send('Canceled')
})
   
module.exports = router;