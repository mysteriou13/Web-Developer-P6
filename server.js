const http = require('http');
const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const port = 3000
var tools = require("./insert.js")
const jwt = require('jsonwebtoken');
const add_sauce = require("./add_sauces.js");

const multer  = require('multer');
const  add_file  = require('./add_sauces.js');
const upload = multer({ dest: 'uploads/' })

const session = require("express-session");

const affiche = require("./affiche_sauce.js");

const like = require("./like.js");

const path = require("path");

const route_singup = require("./route/singup.js");

const route_login = require("./route/login.js");

const one_sauce = require("./route/affiche_one_sauce.js");

const handleGetRequest = require('./route/route_add_sauce.js');

const delete_sauce = require("./route/delete_sauce.js");

app.use(express.json());

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});



app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


 
app.use(session({
    secret: "amar",
    saveUninitialized: true,
    resave: true
}));
 var ssn;
 var ssnemail;
app.get('/',function(req,res){
   ssn =req.session;
 /*
 * Here we have assign the 'session' to 'ssn'.
 * Now we can create any number of session variable we want.    
 * Here we do like this.
 */
 // YOUR CODE HERE TO GET COMPORT AND COMMAND
 ssn.comport; 
 ssn.command; 
});

/*ajout des sauces*/

app.post('/api/sauces', upload.any(), function (req, res, next) {
console.log("add sauces");
 
  add_sauce.add_file();

  
  
      add_sauce.add_sauces(req,res);
res.redirect("./sauces");

})

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*route inscription*/

app.use('/api/auth/signup', route_singup)

/*route connection*/

app.use('/api/auth/login',route_login);


/*affichage des sauces */
app.get('/api/sauces', handleGetRequest)



/*affichage d'une sauce*/
app.get('/api/sauces/:id', one_sauce)


/*delete sauces*/

app.use(delete_sauce);


  app.put('/api/sauces/:id', upload.single('image'),function (req, res, next) {

    add_file.add_file();

    const thingObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  } : { ...req.body };

  var sauce = require("./Sauce.js");

sauce.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
  .then(() => res.status(200).json({message : 'Objet modifié!'}))
  .catch(error => res.status(401).json({ error }));

  
  })



  app.post('/api/sauces/:id/like',function (req, res, next) {

    var sauce = require("./Sauce.js");
   
 
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const like = req.body.like;

    /*like sauce*/
    
    /*like sauce*/
if (like === 1) {
  sauce.updateOne(
    { _id: sauceId },
    {
      $inc: { likes: +1},
      $pull: { usersDisliked: userId },
      $addToSet: { usersLiked: userId }
    }
  )
    .then((sauce) => res.status(200).json({ message: "Sauce appréciée" }))
    .catch((error) => res.status(500).json({ error }));
}

/*dislike sauce*/
if (like === -1) {
  sauce.updateOne(
    { _id: sauceId },
    {
      $inc: { dislikes: +1},
      $addToSet: { usersDisliked: userId },
      $pull: { usersLiked: userId },
    }
  )
    .then((sauce) => res.status(200).json({ message: "Sauce dépréciée" }))
    .catch((error) => res.status(500).json({ error }));
}

/*back like and dislikes*/
if (like == 0) {
  const { MongoClient, ObjectId } = require('mongodb');
  const url = 'mongodb://localhost:27017/';
  const dbName = 'p6_oc';
  
  MongoClient.connect(url, function(err, client) {
    if (err) throw err;
    
    const db = client.db(dbName);
    const collection = db.collection("sauces");
    const query = { _id: new ObjectId(req.params.id) };ff
    const update = { $pull: { usersLiked: req.body.userId, usersDisliked: req.body.userId } };

    collection.findOne(query, function(err, result) {
      if (err) throw err;

      // Condition pour vérifier si le nombre de likes est supérieur à zéro
      if (result.likes > 0) {
        update.$inc = { likes: -1 };
      }

      // Condition pour vérifier si le nombre de dislikes est supérieur à zéro
      if (result.dislikes > 0) {
        update.$inc = { dislikes: -1 };
      }

      collection.findOneAndUpdate(query, update, function(err, result) {
        if (err) throw err;
       
        client.close();
      });
    });

    res.end();
  });
}

    console.log("end route soute")

  })


app.listen(3000, function() {
  console.log(`server listen at: http://localhost:3000/`);
});


     