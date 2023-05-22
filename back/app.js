const http = require('http');
const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000


const path = require("path");
const route_singup = require("./route/singup.js");
const route_login = require("./route/login.js");
const affiche_one_sauce = require("./controller/affiche_one_sauce.js");
const  route_affiche_all_sauce = require('./controller/route_affiche_all_sauce.js');
const route_add_sauce = require("./controller/route_add_sauce.js");
const delete_sauce = require("./controller/delete_sauce.js");
const update_sauce = require("./controller/update_sauce.js");
const like_sauce = require("./controller/like_sauces.js");

const helmet = require('helmet');

app.use(express.json());
app.use(bodyParser.json());
app.use("/image", express.static(path.join(__dirname, "/image/")));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/*ajout des sauce*/

const routes = require("./route/route_sauce.js");


app.use(routes);

app.use(helmet());

app.listen(port, function() {
  console.log(`server listen at: http://localhost:3000/`);
});
