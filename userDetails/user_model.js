
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
    selectCab:{
        type:String,
        default:''
    },
    selectDate:{
        type:String,
        default:''
    },
    selectTiming:{
        type:String,
        default:''
    },
    firstName:String,
    lastName:String,
    email:String,
    travelDistance:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        default:0
    },
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