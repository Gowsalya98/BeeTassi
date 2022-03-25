const mongoose=require('mongoose')

const registerSchema=mongoose.Schema({
    companyName:String,
    presidentName:String,
    email:String,
    password:String,
    contact:Number,
    profileImage:String,
    location:String,
    address:String,
    typeOfVehicle:String,
    ownerId:String,
    deleteFlag:{
        type:String,
        default:false
    },
    role:{
        type:String,
        default:"owner"
    }
})

const register=mongoose.model('ownerRegister',registerSchema)

module.exports={register}