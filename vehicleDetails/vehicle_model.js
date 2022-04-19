const mongoose=require('mongoose')

const vehicleDetailsSchema=mongoose.Schema({
    noOfVehicle:Number,
    vehicleImage:String,
    vehicleDetails:[{
        vehicleType:String,
        vehicleNumber:String,
        rcCopy:String,
        validIn:String,
        insuranceCopy:String,
        insuranceValidIn:String
    }],
    vehicleId:String,
    vehicleOwner:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const vehicleDetailsImageSchema=mongoose.Schema({
    image:String
})

const vehicleDetails=mongoose.model('vehicleDetails',vehicleDetailsSchema)
const vehicleDetailsImage=mongoose.model('vehicleDetailsImage',vehicleDetailsImageSchema)

module.exports={vehicleDetails,vehicleDetailsImage}