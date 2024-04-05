const mongoose = require('mongoose');

const connectToMongo = async () => {
    try {
        await mongoose.connect(`${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`)

        console.log("connect to mongo successfully");

    } catch (err) {
        console.log("failed to connect", err)
    }
};

module.exports = connectToMongo;
