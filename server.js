const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 3000



app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


mongoose.connect('mongodb://localhost:27017/p6_oc',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



/*route inscription*/

app.post('/api/auth/signup', (req, res, next) => {
 
  console.log("singup");

});

/*route connection*/

app.post('/api/auth/login', (req, res, next) => {
 
  console.log("singup");

});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})