const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_PASS}@cluster0.y1wap.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

console


const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 5000

app.get('/', (req,res)=>{
    res.send('hello from db its working')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJoneStorePHero").collection("Products");
  const ordersCollection = client.db("emaJoneStorePHero").collection("order");
  
    app.post('/addProduct', (req,res)=>{
        const product = req.body;
        console.log(product);
        productsCollection.insertOne(product)
        .then(result =>{
            console.log(result);
            res.send(result.insertedCount)
        })
    })

    app.get('/products', (req,res)=>{
        productsCollection.find({})
        .toArray((err,document)=>{
            res.send(document);
        })
    })
    app.get('/product/:key', (req,res)=>{
        productsCollection.find({key: req.params.key})
        .toArray((err,document)=>{
            res.send(document[0]);
        })
    })
    app.post('/productByKeys',(req, res)=>{
        const productKeys =req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, document)=>{
            res.send(document);
        })
    })

    app.post('/addOrder', (req,res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result =>{
            res.send(result.insertedCount>0)
        })
    })



});


app.listen(process.env.PORT || port)