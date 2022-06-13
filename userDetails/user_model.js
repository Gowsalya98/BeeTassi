
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
    perKMPrice:Number,
    serviceAmount:Number,
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
    from:String,
    drop:String,
    deleteFlag:{
        type:String,
        default:'false'
    }
})
const blockedUserSchema=mongoose.Schema({
    userDetails:Object,
    deleteFlag:{
        type:String,
        default:'false'
    }
})
const cancelBookingSchema=mongoose.Schema({
    userId:String,
    userBooking:Object,
    bookingStatus:{
        type:String,
        default:'booked'
    },
    penalityAmount:Number,
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const userBooking=mongoose.model('userBookingSchema',userBookingSchema)

const blockUser=mongoose.model('blockedUserSchema',blockedUserSchema)

const cancelBooking=mongoose.model('cancelBookingSchema',cancelBookingSchema)

module.exports={userBooking,blockUser,cancelBooking}