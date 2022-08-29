
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const app = express();

app.use(cookieParser());

dotenv.config()

app.use(express.static(path.join(__dirname, '/build')));

app.use(bodyParser.json());

app.get('/api/message/', async(req, res) => {
    res.status(200).json({
        message: 'Welcome to the backend'
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});


const server = app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Listening on port ${server.address().port}`);
});
