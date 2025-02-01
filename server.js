const express = require('express');
const cors = require('cors');
require('dotenv').config();
const routes = require("./routes/routes");
const connect = require('./connection/connection');

const PORT = process.env.PORT || 4001;

const app = express();
app.use(express.json());

connect();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});


app.use('/api',routes);
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is Up and Running at ${PORT}`);
})