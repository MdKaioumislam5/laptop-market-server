const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.40hja.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const eventCollection = client.db("laptopMarket").collection("events");

  app.get('/events', (req, res) => {
    eventCollection.find({})
      .toArray((err, items) => {
        res.send(items)
        // console.log('from database', items)
      })
  })
  app.get('/product/:bookType', (req, res) => {
    console.log(req.params.bookType);
    eventCollection.find({ _id: ObjectID(req.params.bookType) })
      .toArray((err, items) => {
        res.send(items[0])
        console.log(items[0]);
      })
  })

  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding new event:', newEvent);
    eventCollection.insertOne(newEvent)
      .then(result => {
        console.log('inserted count', result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('delete/:id', (req, res) => {
    // const id = ObjectID(req.params.id);
    // console.log('delete this', id);
    productCollection.deleteOne({ _id: ObjectID(req.params.id)})
      .then( ( result) => {
        console.log(result);
      })
  })

});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})