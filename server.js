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
const { buildWebpackBrowser } = require('@angular-devkit/build-angular/src/builders/browser/index.js');

app.use(express.json());

app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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

app.post('/api/auth/signup', function (req, res) {


  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {

      tools.singup(req,hash,res);

    });
});
console.log("sinup");


});

/*route connection*/

app.post('/api/auth/login', (req, res, next) => {

  tools.login(req.body.email, req.body.password,res,ssn);

  ssn = req.session;
 ssnemail =req.body.email;

});


/*affichage des sauces */
app.get('/api/sauces', (req, res, next) => {

  console.log("api sauces");

  affiche.affiche_sauce(res);


})


app.get('/api/sauces/:id', (req, res, next) => {


  mongoose.connect('mongodb://localhost:27017/p6_oc',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  console.log("get sauces")

  var User = require('./Sauce.js')


  User.findOne({_id:req.params.id})

  .then(User => res.status(200).json(User))
  .catch(error => res.status(404).json({ error }));


})


app.delete('/api/sauces/:id', (req, res) => {

  

  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("p6_oc");

    dbo.collection("User").findOne({email:ssnemail}, function(err, result) {

      if(result){
      
        console.log("result user");

        delete_user();
   
          }else{

            console.log("error user");

          }
  
      
      db.close();
    });
  });

  function delete_file(file){

    console.log("delete file");

  var User = require('./Sauce.js')
    console.log("delete file",file);

    const fs = require('fs');

    fs.unlink(`./uploads/${file}`, () => {
      User.deleteOne({_id: req.params.id})
          .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
          .catch(error => res.status(401).json({ error }));
  });


    
  }

    
function delete_user(){

  mongoose.connect('mongodb://localhost:27017/p6_oc',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

  console.log("get sauces")

  var User = require('./Sauce.js')


  User.findOne({_id:req.params.id})

  .then(User => {
   
        var filename = User.imageUrl;


        var file = filename.split("uploads")
        
        console.log("delete file");

        var User = require('./Sauce.js')
          console.log("delete file",file);
      
          const fs = require('fs');
      
          fs.unlink(`./uploads/${file}`, () => {
            User.deleteOne({_id: req.params.id})
                .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                .catch(error => res.status(401).json({ error }));
        });
    
})
.catch( error => {
    res.status(500).json({ error });
});
};



})


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
    const query = { _id: new ObjectId(req.params.id) };
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


     