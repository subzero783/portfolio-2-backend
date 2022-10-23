
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const forceSSL = require('express-force-ssl');
const addContactEmail = require('./src/includes/addContactEmail');


const app = express();

app.set('forceSSLOptions', {
    enable301Redirects: true,
    trustXFPHeader: false,
    httpsPort: 443,
    sslRequiredMessage: 'SSL Required.'
});

// app.use(forceSSL);

app.use(cookieParser());

dotenv.config()

app.use(express.static(path.join(__dirname, '/build')));

app.use(bodyParser.json());  

app.get('/api/message/', async(req, res) => {
    res.status(200).json({
        message: 'Welcome to the backend'
    });
});

app.get('/api/contact/', async(req, res)=>{
    addContactEmail(req, res);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
});


const server = app.listen(process.env.PORT || 8000, ()=>{
    console.log(`Listening on port ${server.address().port}`);
});
