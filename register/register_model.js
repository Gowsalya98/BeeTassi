const mongoose=require('mongoose')
const {check}=require('express-validator')

const registerSchema=mongoose.Schema({

    name:String,
    companyName:String,
    email:String,
    password:String,
    newPassword:String,
    confirmPassword:String,
    contact:Number,
    profileImage:{
        type:String,
        default:""
    },
    typeOfVehicle:String,
    typeOfRole:String,
    address:String,
    location:String,
    userId:String,
    ownerId:String,
    deleteFlag:{
        type:String,
        default:false
    }
    
})
const imageSchema=mongoose.Schema({
    image:String
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

const validation = [
    check('email').trim().isEmail().withMessage('email  must be valid'),
    check('password').isLength({ min: '5', max:'10'}).withMessage('password must be minimum 5 character')
]

const register=mongoose.model('register',registerSchema)

const image=mongoose.model('imageSchema',imageSchema)

const sendOtp=mongoose.model('otpSchema',otpSchema)

module.exports={register,sendOtp,image,validation}