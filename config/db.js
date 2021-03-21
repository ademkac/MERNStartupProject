const mongoose = require('mongoose');

const connectDB = async() => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(error){
        console.log(`Error: ${error.message}`)
        process.exit(1);
    }
}

module.exports = connectDB