const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name:String,
    author:String,
    borrow:String,
    returndate:Date,
    genre:String
});
module.exports = mongoose.model('product',productSchema);