

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

// const userHTMLEmail = require('./../emails/user-email-1');

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

        const userHTMLEmail = `<!DOCTYPE html>
        <html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
        
        <head>
            <title></title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
            <!--<![endif]-->
            <style>
                * {
                    box-sizing: border-box;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                }
        
                a[x-apple-data-detectors] {
                    color: inherit !important;
                    text-decoration: inherit !important;
                }
        
                #MessageViewBody a {
                    color: inherit;
                    text-decoration: none;
                }
        
                p {
                    line-height: inherit
                }
        
                .desktop_hide,
                .desktop_hide table {
                    mso-hide: all;
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
        
                @media (max-width:620px) {
                    .desktop_hide table.icons-inner {
                        display: inline-block !important;
                    }
        
                    .icons-inner {
                        text-align: center;
                    }
        
                    .icons-inner td {
                        margin: 0 auto;
                    }
        
                    .row-content {
                        width: 100% !important;
                    }
        
                    .mobile_hide {
                        display: none;
                    }
        
                    .stack .column {
                        width: 100%;
                        display: block;
                    }
        
                    .mobile_hide {
                        min-height: 0;
                        max-height: 0;
                        max-width: 0;
                        overflow: hidden;
                        font-size: 0px;
                    }
        
                    .desktop_hide,
                    .desktop_hide table {
                        display: table !important;
                        max-height: none !important;
                    }
                }
            </style>
        </head>
        
        <body style="background-color: transparent; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
            <table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent;">
                <tbody>
                    <tr>
                        <td>
                            <table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
                                                                <tr>
                                                                    <td class="pad">
                                                                        <div style="color:#101112;direction:ltr;font-family:'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:16px;font-weight:400;letter-spacing:0px;line-height:120%;text-align:left;mso-line-height-alt:19.2px;">
                                                                            <p style="margin: 0; margin-bottom: 16px;">Hey, it's Developer Gus...</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">&nbsp;</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">Thank you ${queryObject.name},for reaching out to me with your message. I will make sure to get back to you shortly.&nbsp;</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;">&nbsp;</p>
                                                                            <p style="margin: 0; margin-bottom: 16px;"><strong>- Developer Gus</strong></p>
                                                                            <p style="margin: 0;"><strong>P.S. Make sure to visit my YouTube channel and learn more about many coding topics including web development.&nbsp;</strong></p>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tbody>
                                    <tr>
                                        <td>
                                            <table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000000; width: 600px;" width="600">
                                                <tbody>
                                                    <tr>
                                                        <td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; padding-top: 5px; padding-bottom: 5px; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
                                                            <table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                <tr>
                                                                    <td class="pad" style="width:100%;padding-right:0px;padding-left:0px;">
                                                                        <div class="alignment" align="left" style="line-height:10px"><a href="https://www.youtube.com/channel/UChuhEhCujTGP1mfmPdtuVhA" target="_blank" style="outline:none" tabindex="-1"><img src="https://portfolio-backend-94.herokuapp.com/images/social-media/youtube-channel-of-developer-gus-2.png" style="display: block; height: auto; border: 0; width: 120px; max-width: 100%;" width="120" alt="YouTube Channel of Developer Gus" title="YouTube Channel of Developer Gus"></a></div>
                                                                    </td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table><!-- End -->
        </body>
        </html>`;

        const userEmail = {
            from: '"Developer Gus" <'+process.env.SEND_GRID_VERIFIED_USER+'>', // sender address
            to: queryObject.email, // list of receivers
            subject: 'Thank You For Contacting Developer Gus', // Subject line
            // text: '<h1>hello</h1>', // plain text body
            html: userHTMLEmail // html body
        };

        sgMail
            .send(userEmail)
            .then(() => {
                console.log('User Email sent')
            })
            .catch((error) => {
                console.error(error)
            });

        const adminEmail = {
            from: '"Developer Gus" <'+process.env.SEND_GRID_VERIFIED_USER+'>',
            to: process.env.SEND_GRID_VERIFIED_USER,
            subject: 'New Home Page Message from DeveloperGus.com',
            html: '<table></table>'
        };  

        // sgMail
        //     .send(adminEmail)
        //     .then(() => {
        //         console.log('Admin Email sent')
        //     })
        //     .catch((error) => {
        //         console.error(error)
        //     });

    } finally {
        await client.close();
    }
}
module.exports = addContactEmail;