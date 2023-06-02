
var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required:[true,"userName needed"]
    },
    email : {
        type:String,
        required:[true,"email needed"]
    },
    password : {
        type:String,
        required:[true,"password needed"]
    },
    cpassword : {
        type:String,
        required:[true,"confirm password needed"]
    },
})

module.exports = mongoose.model('user',userSchema)