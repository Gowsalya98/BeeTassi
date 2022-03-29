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
    driverLocation:{
        driverLatitude:{
            type:Number,
            default:0
        },
        driverLongitude:{
            type:Number,
            default:0
        }
    },
    deleteFlag:{
        type:String,
        default:false
    }
})

const driverDetails=mongoose.model('driverDetails',driverSchema)

module.exports={driverDetails}
    