const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000
var tools = require("./insert.js")

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*route inscription*/

app.post('/api/auth/signup', (req, res, next) => {


  tools.singup(req,res)




});

/*route connection*/

app.post('/api/auth/login', (req, res, next) => {
 
 

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})