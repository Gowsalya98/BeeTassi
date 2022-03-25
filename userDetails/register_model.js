const mongoose=require('mongoose')

const registerSchema=mongoose.Schema({

    userName:String,
    email:String,
    password:String,
    contact:Number,
    pickUpLocation:{
        pickUpLatitude:Number,
        pickUpLongitude:Number
    },
    dropLocation:{
        dropLatitude:Number,
        dropLongitude:Number
    },
    address:String,
    location:String,
    selectVehicle:String,
    userId:String,
    deleteFlag:{
        type:String,
        default:false
    },
    role:{
        type:String,
        default:"user"
    }
    
})

const otpSchema=mongoose.Schema({
    otp:Number
})

const register=mongoose.model('userRegister',registerSchema)
const sendOtp=mongoose.model('otpSchema',otpSchema)

module.exports={register,sendOtp}