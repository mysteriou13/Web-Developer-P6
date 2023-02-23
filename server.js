const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const app = express()
const port = 3000
var tools = require("./insert.js")
const jwt = require('jsonwebtoken');
const { application } = require('express');

const add_sauce = require("./add_sauces.js");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});




app.post('/api/sauces', upload.any(), function (req, res, next) {

 var storage = multer.diskStorage({

		destination:function(request, file, callback)
		{
			callback(null, './upload');
		},
		filename : function(request, file, callback)
		{
			var temp_file_arr = file.originalname.split(".");

			var temp_file_name = temp_file_arr[0];

			var temp_file_extension = temp_file_arr[1];

			callback(null, temp_file_name + '-' + Date.now() + '.' + temp_file_extension+".png");
		}

	});

  
  var pic = req.files;

  var namepic = pic[0].originalname;

  var namepic = namepic.split(".");

  var extpic = namepic[1];

  var namefile = pic[0].filename;


  var full_name = namefile+extpic;

    var tab = req.body.sauce;

    var tab1 = tab.split('{');

    var tab2 = tab1[1];

    var tab2a = tab1[1].split("}");

    var b = tab2a[0];

    
    var b1 = b.split(",");
    
    
     a = [];

     a2 = [];

     for(a = 0; a <= b1.length-1; a++){

      var a1 = b1[a].split(":");
       

      a2.push(a1[1]);

     }
     


     const jwt = require('jsonwebtoken');
     const token = req.headers.authorization.split(' ')[1];
     const decodedToken = jwt.verify(token, 'shhhhh');
     const userId = decodedToken.userId;

     let data = { userId: a2[5], name : a2[0],  manufacturer : a2[1], description : a2[2], mainPepper : a2[3], "imageUrl" :namefile+"."+extpic, 
     heat : a2[4], like : 0,  dislikes : 0, usersLiked:0, usersDisliked: 0,} 


      add_sauce.add_sauces(req,res,data);

    // Everything went fine.
  


})

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

/*route inscription*/

app.post('/api/sauces', function (req, res) {


  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {

      tools.singup(req,hash,res);

    });
});
console.log("sinup");

res.end();
});

/*route connection*/

app.post('/api/auth/login', (req, res, next) => {

  tools.login(req.body.email, req.body.password,res);


});


app.get('/api/sauces', (req, res, next) => {

  res.end();

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




