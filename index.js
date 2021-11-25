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
        const usersCollection = database.collection('users');



        //Get appionments

        app.get ('/appointments',async (req,res)=>{
          const cursor = appionmentsCollection.find({});
          const appionments = await cursor.toArray();
          res.json(appionments);
        })

        //Get appionments by email

        app.get ('/appointments/email',async (req,res)=>{
          const email = req.body;
          const query = {email:email}
          const cursor = appionmentsCollection.find(query);
          const appionments = await cursor.toArray();
          res.json(appionments);
        })

        //Add Appointment
        app.post('/appointments',async (req,res)=>{

          const appionment = req.body;
          console.log(appionment);
          const result = await appionmentsCollection.insertOne(appionment);
          res.json(result);
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            user.role = 'user';
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        app.put('/users', async (req, res) => {
            const user = req.body;
            const  requester = user.email;
            const requesterAccount = await usersCollection.findOne({ email: requester });
            if (!requesterAccount)
            {
                user.role = 'user';
            }
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);


        });

        //Updata Order status
        app.put('/status/:id',async (req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const data = req.body;
            const updateDoc = {
                $set: {
                    status: data.status
                },
            };
            console.log(data);
            const order = await appionmentsCollection.updateOne(query,updateDoc);
            res.json(order);
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
