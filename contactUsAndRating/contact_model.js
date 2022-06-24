const mongoose=require('mongoose')
const { randomString } = require('../userDetails/random_string')

const contactUsSchema=mongoose.Schema({
    createdAt:String,
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

const aboutUsSchema=mongoose.Schema({
    createdAt:String,
    aboutTitle:String,
    subTitle:String,
    happyCustomer:String,
    luxuryCars:Number,
    kilometersDriven:String,
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const rating=mongoose.model('ratingSchema',ratingSchema)

const contactUs=mongoose.model('contactUsSchema',contactUsSchema)

const aboutUs=mongoose.model('aboutUsSchema',aboutUsSchema)

module.exports={contactUs,rating,aboutUs}