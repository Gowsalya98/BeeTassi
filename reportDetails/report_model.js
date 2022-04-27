const mongoose=require('mongoose')

const reportSchema=mongoose.Schema({

    vehicleNumber:String,
    message:String,
    userDetails:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:'false'
    }
})

const report=mongoose.model('reportDetails',reportSchema)

module.exports={report}
    