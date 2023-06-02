
var mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    products : Array,
    userId : String
})

module.exports = mongoose.model('Cart',cartSchema)