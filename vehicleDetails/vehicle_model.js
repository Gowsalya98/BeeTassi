const mongoose=require('mongoose')

const vehicleDetailsSchema=mongoose.Schema({
    noOfVehicle:Number,
    vehicleImage:{
        type:String,
        default:""},
    vehicleDetails:[{
        vehicleType:String,
        vehicleNumber:String,
        rcCopy:String,
        validIn:String,
        insuranceCopy:String,
        insuranceValidIn:String,
        deleteFlag:{
            type:String,
            default:"false"
        }
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