

const express = require('express');
const router = express.Router();
router.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const client = require('../includes/databaseConnect');
const url = require('url');

const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

async function addContactEmail(req, res){
    try{

        const queryObject = url.parse(req.url, true).query;

        await client.connect();

        const collection = client.db('Homepagecontact').collection('messages');

        const userMessage = {
            "email" : queryObject.email, 
            "name" : queryObject.name, 
            "message" : queryObject.message
        };

        const objectSent = await collection.insertOne(userMessage);

        let contactEmailMessage = null;

        if( objectSent.acknowledged === true ){
            contactEmailMessage = 'We have received your message and will get back to shortly!'
        }else{
            contactEmailMessage = 'Something went wrong!'
        }

        res.header('Access-Control-Allow-Origin', '*');
        res.send({
            data: contactEmailMessage
        });

        const userEmail = {
            from: '"Developer Gus" <'+process.env.SEND_GRID_VERIFIED_USER+'>', // sender address
            to: queryObject.email, // list of receivers
            subject: 'Thank You For Contacting Developer Gus', // Subject line
            text: '<h1>hello</h1>', // plain text body
            // html: '<b>NodeJS Email Tutorial</b>' // html body
        };

        sgMail
            .send(userEmail)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            });


    } finally {
        await client.close();
    }
}
module.exports = addContactEmail;