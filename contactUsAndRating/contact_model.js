const mongoose=require('mongoose')
const { randomString } = require('../userDetails/random_string')

const contactUsSchema=mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    Message:String
})

const ratingSchema=mongoose.Schema({
    userId:String,
    cabId:String,
    rating:{
        type:Number,
        default:0
    },
    numOfPersons:{
        type:Number,
        default:0
    }
})

const rating=mongoose.model('ratingSchema',ratingSchema)
const contactUs=mongoose.model('contactUsSchema',contactUsSchema)


module.exports={contactUs,rating}