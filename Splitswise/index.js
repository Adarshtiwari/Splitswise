const express=require('express')
const app=express();
const mongoose = require('mongoose');
const centralroute=require('./Route/CenteralRoute')


const bodyParser = require('body-parser');


require('dotenv').config()

const PORT=process.env.PORT || 500
const uri=process.env.DB_URI

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT,()=>{
    console.log(`server is running On ${PORT}`)
})

const promise =mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true,  writeConcern: {
  w: 'majority',
  wtimeout: 0,
  provenance: 'clientSupplied',
} })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use("/",centralroute)

//not foud 
// app.use((req, res) => {
//   res.status(404).send('Not Found');
// });
const conn=mongoose.connection;







