module.exports = {
    singup: function(login,password) {
        var mongoose = require('mongoose');
 
        // make a connection 
        mongoose.connect('mongodb://localhost:27017/p6_oc');
         
        // get reference to database
        var db = mongoose.connection;
         
        db.on('error', console.error.bind(console, 'connection error:'));
         
        db.once('open', function() {
            console.log("Connection Successful!");
             
            // define Schema
            var BookSchema = mongoose.Schema({
              price: String,
              quantity: String
            });
         
            // compile schema to model
            var Book = mongoose.model('open_classrom', BookSchema, 'open_classrom');
         
            // a document instance
            var book1 = new Book({ price: login, quantity: password });
         
            // save model to database
            book1.save(function (err, book) {
              if (err) return console.error(err);
              console.log(book.name + " saved to bookstore collection.");
            });
             
        });
        
 
    },
 
};