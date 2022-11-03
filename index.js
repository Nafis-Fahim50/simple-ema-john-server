const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json())

// const uri = 'mongodb://localhost:27017';
// const client = new MongoClient(uri);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6llxg7j.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
    try{
        const productCollection = client.db('emajohn').collection('products');

        app.get('/products', async(req,res)=>{
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            console.log(page,size);
            const query = {}
            const cursor = productCollection.find(query)
            const products = await cursor.skip(page*size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({count,products});
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/',(req,res) => {
    res.send('Ema-john server is running');
})

app.listen(port, ()=>{
    console.log('Server is running on',port);
})