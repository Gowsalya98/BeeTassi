const mongoose=require('mongoose')

const cabDetailsSchema=mongoose.Schema({
    // noOfVehicle:Number,
    // vehicleImage:{
    //     type:String,
    //     default:""
    // },
    // vehicleDetails:[{
    //     vehicleType:String,
    //     vehicleNumber:String,
    //     rcCopy:String,
    //     validIn:String,
    //     insuranceCopy:String,
    //     insuranceValidIn:String,
    //     deleteFlag:{
    //         type:String,
    //         default:"false"
    //     }
    // }],
    createdAt:String,
    carModel:String,
    carBrand:String,
    carImage:String,
    numberOfSeats:Number,
    carRegNumber:String,
    perKMPrice:Number,
    rcBookNumber:String,
    frontRcBookImage:String,
    backRcBookImage:String,
    cabOwnerId:String,
    driverId:String,
    rating:{
        type:Number,
        default:0
    },
    cabOwner:{
        type:Object
    },
    cabDriver:{
        type:Object
    },
    cabStatus:{
        type:String,
        default:'available'
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const cabImageSchema=mongoose.Schema({
    image:String
})

const cabDetails=mongoose.model('cabDetails',cabDetailsSchema)
const cabImage=mongoose.model('cabImageSchema',cabImageSchema)

module.exports={cabDetails,cabImage}