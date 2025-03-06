const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.noaml.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const user_sports = client.db('sportsDB').collection('sports');
    const user_login = client.db('sportsDB').collection('users');


    // users sports crud
    app.get('/sports', async (req, res) => {
      const cursor = user_sports.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/sports/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await user_sports.findOne(query);
      res.send(result);
    })

    app.post('/sports', async (req, res) => {
      const new_sports = req.body;
      const result = await user_sports.insertOne(new_sports);
      res.send(result);
    })

    app.put('/sports/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updated_sports = req.body;
      console.log(updated_sports, filter);
      const sports = {
        $set: {
          item_name: updated_sports.item_name,
           category_name: updated_sports.category_name,
           image: updated_sports.image,
           description: updated_sports.description,
           price: updated_sports.price,
           rating: updated_sports.rating,
           delivery: updated_sports.delivery,
           customization: updated_sports.customization,
           status : updated_sports.status
        }
      }
      const result = await user_sports.updateOne(filter, sports, options);
      res.send(result)
    })

    app.delete('/sports/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await user_sports.deleteOne(query);
      res.send(result);
    })

    // users management crud

    app.post('/users', async (req, res) => {
      const new_user = req.body;
      const result = await user_login.insertOne(new_user);
      res.send(result);
    })

    app.get('/users', async (req, res) => {
      const cursor = user_login.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //     await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Cricket Sports Server is Running');
})

app.listen(port, () => {
  console.log(`Cricket Sports Server is Running Now: ${port}`);
})