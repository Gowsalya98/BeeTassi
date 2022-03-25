const mongoose = require('mongoose')
const {check}=require('express-validator')

const registerSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    role:{
        type:String,
        default:"superAdmin"
    }
})

const validation = [
    check('email').trim().isEmail().withMessage('email  must be valid'),
    check('password').isLength({ min: 5}).withMessage('password must be minimum 5 character')
    
]

const register=mongoose.model('superAdminRegister',registerSchema)

module.exports={register,validation}