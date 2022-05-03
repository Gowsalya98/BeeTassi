const mongoose=require('mongoose')

const paymentSchema=mongoose.Schema({
    paymentId:String,
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
    }
})

const paymentIdSchema=mongoose.Schema({
    paymentId:String
})

const payment=mongoose.model('paymentDetails',paymentSchema)
const orderData=mongoose.model('paymentIdSchema',paymentIdSchema)

module.exports={payment,orderData}
    