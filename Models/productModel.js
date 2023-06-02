
var mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name : {
        type:String,
        required:[true,"name needed"]
    },
    price : {
        type:String,
        required:[true,"price needed"]
    },
    offer : {
        type:String,
        required:[true,"offer needed"]
    },
    description : {
        type:String,
        required:[true,"description needed"]
    },
})

module.exports = mongoose.model('products',productSchema)