module.exports = { 

update_sauce : function (req){

   var sauce = require("./Sauce.js");
   
  sauce.findOne({ _id: req })
  .then(thing => res.status(200).json(thing))



},


like_sauce : function (req){


}


}