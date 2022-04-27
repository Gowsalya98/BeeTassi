
const mongoose=require('mongoose')

const userBookingSchema=mongoose.Schema({
    pickUpLocation:{
        pickUpLatitude:Number,
        pickUpLongitude:Number
    },
    dropLocation:{
        dropLatitude:Number,
        dropLongitude:Number
    },
    selectVehicle:String,
    travelDistance:String,
    price:Number,
    rideStatus:{
        type:String,
        default:'pending'
    },
    userDetails:{
       type:Object 
    }
})

const userBooking=mongoose.model('userBookingSchema',userBookingSchema)

module.exports={userBooking}