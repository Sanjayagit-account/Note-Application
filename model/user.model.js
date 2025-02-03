const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:[true,'Email already exists']
    },
   
  // role:{
    //type:String,
    //enum:["Admin","User","Chef","Waiter"]
  // },
   password:{
    type:String,
    required:[true,'password is required'],
   },
   createdAt:{
    type:Date,
    default:Date.now(),
   },
   
})

module.exports=mongoose.model('User', userSchema)