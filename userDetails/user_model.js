
const mongoose=require('mongoose')

const userBookingSchema=mongoose.Schema({
    createdAt:{
        type:Date,
        default: new Date()
    },
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
    },
    drop:String
})


const userBooking=mongoose.model('userBookingSchema',userBookingSchema)

module.exports={userBooking}