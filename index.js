const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT||5000;
const ObjectId = require('mongodb').ObjectId;


//middelwere
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5cmdn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('medi-care');
        const appionmentsCollection = database.collection('appionments');


        //Get appionments

        app.get ('/appionments',async (req,res)=>{
          const cursor = appionmentsCollection.find({});
          const appionments = await cursor.toArray();
          res.json(appionments);
        })

    }
    finally
    {

    }
}

run().catch(console.dir)

app.get('/', (req,res)=>{

    res.send("Server start");
})
app.listen(port,()=>{
    console.log('port listening at ',port)
})
