const mongoose=require('mongoose')

const driverSchema=mongoose.Schema({
    companyName:String,
    candidateName:String,
    email:String,
    password:String,
    contact:Number,
    profileImage:String,
    drivingLicense:String,
    licenseValidIn:String,
    typeOfVehicle:String,
    driverId:String,
    deleteFlag:{
        type:String,
        default:false
    },
    role:{
        type:String,
        default:"driver"
    }

})

const driverDetails=mongoose.model('driverDetails',driverSchema)

module.exports={driverDetails}
    