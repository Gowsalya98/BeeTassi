const mongoose=require('mongoose')

const registerSchema=mongoose.Schema({

    name:String,
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
    profileImage:String,
    typeOfVehicle:String,
    typeOfRole:String,
    address:String,
    location:String,
    selectVehicle:String,
    userId:String,
    ownerId:String,
    deleteFlag:{
        type:String,
        default:false
    }
    
})

const otpSchema=mongoose.Schema({
    otp:Number,
    userDetails:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:false
    }
})

const register=mongoose.model('userAndOwnerRegister',registerSchema)

const sendOtp=mongoose.model('otpSchema',otpSchema)

module.exports={register,sendOtp}