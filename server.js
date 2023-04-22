const http = require('http');
const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000


const path = require("path");
const route_singup = require("./route/singup.js");
const route_login = require("./route/login.js");
const affiche_one_sauce = require("./route/affiche_one_sauce.js");
const  route_affiche_all_sauce = require('./route/route_affiche_all_sauce.js');
const route_add_sauce = require("./route/route_add_sauce.js");
const delete_sauce = require("./route/delete_sauce.js");
const update_sauce = require("./route/update_sauce.js");
const like_sauce = require("./route/like_sauces.js");

const { verifyToken } = require('./verif_token.js');

const helmet = require('helmet');

app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
/*ajout des sauce*/

app.use('/api/sauces', route_add_sauce);

/*route inscription*/
app.use('/api/auth/signup', route_singup)

/*route connection*/
app.use('/api/auth/login',route_login);

/*affichiage all  sauces */

app.get('/api/sauces', verifyToken, route_affiche_all_sauce);

/*affichage d'une sauce*/
app.get('/api/sauces/:id', verifyToken ,affiche_one_sauce)

/*delete sauces*/
app.use(delete_sauce);

/*update sauce*/
app.use(update_sauce);

/*like  sauce*/
app.use(like_sauce);


app.use(helmet());

app.listen(port, function() {
  console.log(`server listen at: http://localhost:3000/`);
});
