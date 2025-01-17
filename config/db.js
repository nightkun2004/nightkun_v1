const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
    console.log("Connection.......")
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: false,
            // useUnifiedTopology: true
        });
        console.log("MongoDB Connected!");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

// require('node:crypto-js').randomBytes(24).toString('hex')

module.exports = connectDB;