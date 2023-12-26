const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    category : String,
    name : String,
    rating : Number,
    numberOfReviews : Number,
    inStock : Boolean,
    description : String,
    price : Number,
    itemsRemaining : Number,
    promo : Number,
    nameInDirectory : String,
    properties : Object,
    allImages : Array

});

module.exports = mongoose.model('product', ProductSchema);
