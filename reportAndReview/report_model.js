const mongoose=require('mongoose')

const reportSchema=mongoose.Schema({

    cabId:String,
    message:String,
    userDetails:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const reviewSchema=mongoose.Schema({
    cabId:String,
    message:String,
    userDetails:{
        type:Object
    }
})

const report=mongoose.model('reportDetails',reportSchema)
const review=mongoose.model('reviewSchema',reviewSchema)

module.exports={report,review}
    