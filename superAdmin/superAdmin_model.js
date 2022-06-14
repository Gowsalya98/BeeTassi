const mongoose=require('mongoose')

const superAdminSchema=mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    contact:Number,
    newPassword:String,
    confirmPassword:String,
    profileImage:{type:String,default:'false'},
    location:String,
    gender:String,
    desc:String,
    education:String,
    experience:String,
    aboutMe:String,
    operationDone:String,
    degree:String,
    designation:String,
    address:String,
    typeOfRole:{
        type:String,
        default:'superAdmin'
    },
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const otpSchema=mongoose.Schema({
    otp:Number,
    superDetails:{
        type:Object
    }
})

const superadmin=mongoose.model('superAdminSchema',superAdminSchema)
const sendOtp=mongoose.model('superAdminOtpSchema',otpSchema)

module.exports={superadmin,sendOtp}