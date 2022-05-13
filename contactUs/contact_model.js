const mongoose=require('mongoose')

const contactUsSchema=mongoose.Schema({
    name:String,
    email:String,
    subject:String,
    Message:String
})

const contactUs=mongoose.model('contactUsSchema',contactUsSchema)


module.exports={contactUs}