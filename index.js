const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dp83dff.mongodb.net/?retryWrites=true&w=majority`;

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
    client.connect();
    // collections
    const usersCollection = client.db("userManagement").collection("users");

    // api
    app.get("/users", async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      });

    app.post("/users", async (req, res) => {
        const user = req.body;
        const query = { email: user.email };
        const existingUser = await usersCollection.findOne(query);
  
        if (existingUser) {
          return res.send({ message: "user already exists" });
        }
  
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });

      app.put("/users/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedClass = req.body;
        const updateDoc = {
          $set: {
            name: updatedClass.name,
            email: updatedClass.email,
            phone: updatedClass.phone,
          },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
  
        res.send(result);
      });

      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await usersCollection.deleteOne(query);
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running............yey!!");
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });