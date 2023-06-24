const http = require('http');

require('dotenv').config();

const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000;

const path = require("path");
const route_singup = require("./route/singup.js");
const route_login = require("./route/login.js");

const route_add_sauce = require("./route/route_add_sauce.js");
const delete_sauce = require("./route/route_delete.js");
const update_sauce = require("./route/route_update_sauces.js");
const like_sauce = require("./route/route_like_sauces.js");

const controller = require("./controller/controler_sauce");

const middleware = require('./middleware/middleware_sauce');



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
/*ajout des sauce*/

app.use('/api/sauces', route_add_sauce);

/*route inscription*/
app.use('/api/auth/signup', route_singup);

/*route connection*/
app.use('/api/auth/login', route_login);

/*affichage all sauces */
app.get('/api/sauces', middleware.verifyToken, controller.all_sauce);

/*affichage d'une sauce*/
app.get('/api/sauces/:id', middleware.verifyToken, controller.one_sauce);

/*delete sauces*/
app.use(delete_sauce);

/*update sauce*/
app.use(update_sauce);

/*like sauce*/
app.use(like_sauce);


app.use(helmet());

app.listen(port, function() {
  console.log(`server listen at: http://localhost:3000/`);
});
