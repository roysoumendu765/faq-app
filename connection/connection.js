const mongoose = require('mongoose');
require('dotenv').config();

const USERNAME = process.env.DB_USERNAME
const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

const URI = process.env.DB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.bpncd.mongodb.net/managefaqs`;

const DB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("DB up and running");
    } catch (error) {
        console.log(`Error: ${error}`);
        await mongoose.disconnect();
    }
}

module.exports = DB;