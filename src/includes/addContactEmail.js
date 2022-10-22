

const express = require('express');
const router = express.Router();
router.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const client = require('./databaseConnect');
const url = require('url');

const bodyParser = require('body-parser');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

const userHTMLEmail = require('../emails/userHTMLEmail');
const adminHTMLEmail = require('../emails/adminHTMLEmail');

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

        const htmlEmailUser = userHTMLEmail(queryObject.name);

        const userEmail = {
            from: '"Developer Gus" <'+process.env.SEND_GRID_VERIFIED_USER+'>', // sender address
            to: queryObject.email, // list of receivers
            subject: 'Thank You For Contacting Developer Gus', // Subject line
            // text: '<h1>hello</h1>', // plain text body
            html: htmlEmailUser // html body
        };

        sgMail
            .send(userEmail)
            .then(() => {
                console.log('User Email sent')
            })
            .catch((error) => {
                console.error(error)
            });

        const htmlEmailAdmin = adminHTMLEmail(queryObject.email, queryObject.name, queryObject.message);

        const adminEmail = {
            from: '"Developer Gus" <'+process.env.SEND_GRID_VERIFIED_USER+'>',
            to: process.env.SEND_GRID_VERIFIED_USER,
            subject: 'New Home Page Message from DeveloperGus.com',
            html: htmlEmailAdmin
        };  

        sgMail
            .send(adminEmail)
            .then(() => {
                console.log('Admin Email sent')
            })
            .catch((error) => {
                console.error(error)
            });

    } finally {
        await client.close();
    }
}
module.exports = addContactEmail;