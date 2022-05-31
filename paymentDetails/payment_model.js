const mongoose=require('mongoose')

const paymentSchema=mongoose.Schema({
    paymentId:String,
    accountHolderName:String,
    bankName:String,
    branchAddress:String,
    accountNumber:String,
    IFSCCode:String,
    amount:Number,
    paymentOn:{
        type:String,
        default:'paid'
    },
    createdAt:String,
    transactionStatus: {
        type: String,
        default: "Success"
    },
    user:{
        type:Object
    }
})

const paymentIdSchema=mongoose.Schema({
    paymentId:String
})

const payment=mongoose.model('paymentDetails',paymentSchema)

const orderData=mongoose.model('paymentIdSchema',paymentIdSchema)

module.exports={payment,orderData}
    