


const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoUri = process.env.MONGODB_URI;

const client = new MongoClient(mongoUri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    serverApi: ServerApiVersion.v1 
});

module.exports = client;