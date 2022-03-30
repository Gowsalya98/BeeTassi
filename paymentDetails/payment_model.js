const mongoose=require('mongoose')

const paymentSchema=mongoose.Schema({
    accountHolderName:String,
    paymentId:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    location:String,
    paymentOn:String,
    amount:Number,
    transactionStatus: {
        type: String,
        default: "Success"
    },
    userDetails:{
        type:Object
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const payment=mongoose.model('paymentDetails',paymentSchema)

module.exports={payment}
    