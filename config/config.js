
var mongoose = require('mongoose');

const con = ()=>
{
    return mongoose.connect("mongodb+srv://vidhyasoman:98765@cluster0.eanf0x9.mongodb.net/Shopybuddy?retryWrites=true&w=majority")
}

module.exports = con;