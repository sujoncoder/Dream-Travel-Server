const express = require("express");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wsejt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("assignment-11");
    const PlaceCollection = database.collection("assignment-11-data");
    const orderCollection = database.collection("orders");
    // POST API
    app.post("/places", async (req, res) => {
      const newPlace = req.body;
      const result = await PlaceCollection.insertOne(newPlace);
      res.json(result);
    });
    // GET API
    app.get("/places", async (req, res) => {
      const cursor = PlaceCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // find specific API
    app.get("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await PlaceCollection.findOne(query);
      res.json(result);
    });

    // DELETE API
    app.delete("/places/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await PlaceCollection.deleteOne(query);
      res.json(result);
    });

    // POST ORDER API
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      console.log(newOrder);
      const result = await orderCollection.insertOne(newOrder);
      res.json(result);
    });
    // get orders API
    app.get("/orders", async (req, res) => {
      const cursor = orderCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    // get my orders API
    app.get("/orders/:email", async (req, res) => {
      const email = req.params.email;
      const result = await orderCollection.find({ email: email }).toArray();
      res.json(result);
    });

    // DELETE  ORDERS
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const updateOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          tourName: updateOrder.tourName,
          name: updateOrder.name,
          email: updateOrder.email,
          phone: updateOrder.phone,
          address: updateOrder.address,
          status: updateOrder.status,
          img: updateOrder.img,
        },
      };
      const result = await orderCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
