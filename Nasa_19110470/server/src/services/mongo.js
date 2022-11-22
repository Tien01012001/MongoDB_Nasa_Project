const mongoose = require('mongoose')

require('dotenv').config();

const MONGO_URl = process.env.MONGO_URl;


mongoose.connection.once('open', () => {
    console.log('Mongoose connection');
})


mongoose.connection.on('error', (err)=>{{
    console.error(err)
}});

async function mongoConnection(){
    await mongoose.connect(MONGO_URl)
}

async function mongoConnection(){
    await mongoose.disconnect();
}

module.exports = {
    mongoConnection,
    mongoConnection
}