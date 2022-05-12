const mongoose=require('mongoose')
const {check}=require('express-validator')

const registerSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    firstName:{
        type:String,
        default:""
    },
    lastName:{
        type:String,
        default:""
    },
    alternativePhoneNumber:{
        type:Number,
        default:""
    },
    city:{
        type:String,
        default:""
    },
    pincode:{
        type:Number,
        default:""
    },
    newPassword:String,
    confirmPassword:String,
    contact:{
        type:Number,
        default:""
    },
    profileImage:{
        type:String,
        default:""
    },
    typeOfRole:String,
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