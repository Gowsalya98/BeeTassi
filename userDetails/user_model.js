
const mongoose=require('mongoose')

const userBookingSchema=mongoose.Schema({
    createdAt:String,
    pickUpLocation:{
        pickUpLatitude:Number,
        pickUpLongitude:Number
    },
    dropLocation:{
        dropLatitude:Number,
        dropLongitude:Number
    },
    contact:Number,
    selectCab:String,
    selectDate:String,
    selectTiming:String,
    selectSeats:Number,
    payOption:String,
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