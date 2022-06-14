const mongoose=require('mongoose')

const reportSchema=mongoose.Schema({
    createdAt:String,
    quotes:String,
    description:String,
    userDetails:{
        type:Object
    },
    cab:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const reviewSchema=mongoose.Schema({
    createdAt:String,
    quotes:String,
    description:String,
    cabId:String,
    userId:String,
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const report=mongoose.model('reportDetails',reportSchema)
const review=mongoose.model('reviewSchema',reviewSchema)

module.exports={report,review}
    