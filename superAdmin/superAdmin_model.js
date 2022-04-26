const mongoose=require('mongoose')

const superAdminSchema=mongoose.Schema({
    userName:String,
    email:String,
    password:String,
    contact:String,
    typeOfRole:{
        type:String,
        default:'superAdmin'
    },
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const superadmin=mongoose.model('superAdminSchema',superAdminSchema)

module.exports={superadmin}