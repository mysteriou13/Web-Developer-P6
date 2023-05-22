const express = require('express');
const app = express();

const route_singup = require("./singup.js");
const route_login = require("./login.js");
const affiche_one_sauce = require("../controller/affiche_one_sauce.js");
const route_affiche_all_sauce = require('../controller/route_affiche_all_sauce.js');
const route_add_sauce = require("../controller/route_add_sauce.js");
const delete_sauce = require("../controller/delete_sauce.js");
const update_sauce = require("../controller/update_sauce.js");
const like_sauce = require("../controller/like_sauces.js");


const { verifyToken } = require('../middleware/verif_token.js');

app.use('/api/sauces', route_add_sauce);

/*route inscription*/
app.use('/api/auth/signup', route_singup);

/*route connection*/
app.use('/api/auth/login', route_login);

/*affichage all sauces */
app.get('/api/sauces', verifyToken, route_affiche_all_sauce);

/*affichage d'une sauce*/
app.get('/api/sauces/:id', verifyToken, affiche_one_sauce);

/*delete sauces*/
app.use(delete_sauce);

/*update sauce*/
app.use(update_sauce);

/*like sauce*/
app.use(like_sauce);

module.exports = app;
