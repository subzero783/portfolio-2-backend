

const express = require('express');
const router = express.Router();
router.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const client = require('../includes/databaseConnect');
const url = require('url');

const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

async function addContactEmail(req, res){
    try{

    } finally {
        await client.close();
    }
}
module.exports = addContactEmail;