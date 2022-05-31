
const mongoose=require('mongoose')

const userBookingSchema=mongoose.Schema({
    createdAt:String,
    pickUpLocation:{
        pickUpLatitude:{
            type:Number,
            default:0
        },
        pickUpLongitude:{
            type:Number,
            default:0
    }
},
    dropLocation:{
        dropLatitude:{
            type:Number,
            default:0
        },
        dropLongitude:{
            type:Number,
            default:0
    }
},
    contact:Number,
    selectDate:String,
    selectTiming:String,
    firstName:String,
    lastName:String,
    email:String,
    travelDistance:String,
    price:Number,
    rideStatus:{
        type:String,
        default:'pending'
    },
    userId:String,
    cabId:String,
    userDetails:{
       type:Object 
    },
    cabDetails:{
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