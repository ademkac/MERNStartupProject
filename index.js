const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const dotenv= require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors')
const jobRoutes = require('./routes/jobRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const memberRoutes = require('./routes/memberRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const downloadsRoutes = require('./routes/downloadsRoutes');
const chatRoutes = require('./routes/chatRoutes');
const fundingRoutes = require('./routes/fundingRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const inboxRoutes = require('./routes/inboxRoutes');
const odobreniRoutes = require('./routes/odobreniRoutes');
const payRoutes = require('./routes/payRoutes');
const proveraRoutes = require('./routes/proveraRoutes')

const HttpError = require('./models/http-error');



dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());



app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
})

/* app.use(cors({
  origin: process.env.FRONTEND_URL_PRODUCTION
})) */
app.use('/api/projects', projectRoutes)
app.use('/api/jobs', jobRoutes)
app.use('/api/users', userRoutes);
app.use('/api/membership', memberRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/downloads', downloadsRoutes);
app.use('/api/fundings', fundingRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/inbox', inboxRoutes);
app.use('/api/odobreni', odobreniRoutes);
app.use('/api/provera', proveraRoutes)
app.use(cors())
app.use('/api/pay', payRoutes);
app.get('/api/config/paypal', (req, res)=>{
  res.send(process.env.PAYPAL_CLIENT_ID)
})
app.use('/', chatRoutes)

/* const __dirname = path.resolve() */

/* if(process.env.NODE_ENV === 'production'){
  app.use(express.static('./frontend-si/build'))
  app.get('*', (req, res)=> 
  res.sendFile(path.resolve(__dirname, 'frontend-si', 'build', 'index.html')))
}  */

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
  });
  
  app.use((error, req, res, next) => {
      if (req.file) {
          fs.unlink(req.file.path, err => {
            console.log(err);
          });
        }
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  module.exports = app;