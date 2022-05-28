
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
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    travelDistance:String,
    price:Number,
    rideStatus:{
        type:String,
        default:'pending'
    },
    userDetails:{
       type:Object 
    },
    drop:String,
    deleteFlag:{
        type:String,
        default:'false'
    }
})


const userBooking=mongoose.model('userBookingSchema',userBookingSchema)

module.exports={userBooking}