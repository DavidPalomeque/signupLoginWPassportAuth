// Here is the data structure model of the user

const mongoose = require("mongoose")
const {Schema} = mongoose // For create a new data structure model

const User = new Schema({
    name : {type : String , required : true} ,
    email : {type : String , required : true} ,
    password : {type : String , required : true} ,
    date : {type : Date , default : Date.now()}
})

module.exports = mongoose.model("User" , User)