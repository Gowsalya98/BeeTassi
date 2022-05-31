const mongoose=require('mongoose')

const driverSchema=mongoose.Schema({
    createdAt:String,
    driverName:String,
    email:String,
    password:String,
    contact:Number,
    profileImage:String,
    drivingLicense:String,
    frontImageLicense:String,
    backImageLicense:String,
    carRegNumber:String,
    ownerId:String,
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
    // ownerDetails:{
    //     type:Object
    // },
    deleteFlag:{
        type:String,
        default:false
    },
    typeOfRole:{
        type:String,
        default:"driver"
    }
})

const driverDetails=mongoose.model('driverDetails',driverSchema)

module.exports={driverDetails}
    