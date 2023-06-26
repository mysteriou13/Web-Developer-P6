const http = require('http');

require('dotenv').config();

const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000;

const path = require("path");


const route_add_sauce = require("./route/route_sauce.js");

const helmet = require('helmet');

app.use(express.json());
app.use(bodyParser.json());
app.use("/images", express.static(path.join(__dirname, "/images/")));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*ajout des route*/
app.use(route_add_sauce);


app.use(helmet());

app.listen(port, function() {
  console.log(`server listen at: http://localhost:3000/`);
});
