const http = require('http');
const express = require('express')
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

const sharp = require('sharp');

const fs = require("fs");

const app = express()
const port = 3000

const add_sauce = require("./add_sauces.js");
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });



const path = require("path");
const route_singup = require("./route/singup.js");
const route_login = require("./route/login.js");
const affiche_one_sauce = require("./route/affiche_one_sauce.js");
const  route_add_sauce = require('./route/route_affiche_all_sauce.js');
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

app.post('/api/sauces', upload.any(), function (req, res) {
  const files = req.files;


  let filename = '';
  
  files.forEach(function (file) {
 
    filename = file.filename;
  
  
  });
  
  /*convertion au forma webp*/
  const filePath = 'uploads/' + filename;
  const newExtension = '.webp';
  const fileExtension = path.extname(filePath);
  const fileBaseName = path.basename(filePath, fileExtension);
  const newFilePath = path.join(
    path.dirname(filePath),
    fileBaseName + newExtension
  );
  
  const newname = fileBaseName + newExtension;
  
  
  sharp(filePath)

  .resize({
    width: 200,
    height: 200,
    fit: 'inside',
    withoutEnlargement: true
  })

  .webp()
    .toBuffer((err, buffer) => {
      if (err) throw err;
      // Write the converted file to disk
      fs.writeFile(newFilePath, buffer, (err) => {
        if (err) throw err;
  
        // Delete the original file
        fs.unlink(filePath, (err) => {
          if (err) throw err;
          console.log('File deleted succ^essfully!');
        });
  
        console.log('File converted successfully!');
        // Call add_sauce.add_sauces after the file is converted
        add_sauce.add_sauces(req, res, newname);
        res.redirect('/api/sauces');
      });
    });
  

});

/*route inscription*/
app.use('/api/auth/signup', route_singup)

/*route connection*/
app.use('/api/auth/login',route_login);

/*ajout des sauces */

app.get('/api/sauces', verifyToken, route_add_sauce);

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
