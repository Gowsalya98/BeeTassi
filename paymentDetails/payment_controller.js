const {payment}=require('./payment_model')
const {register}=require('../register/register_model')
const {makeId}=require('../userDetails/random_string')
const res = require('express/lib/response')

exports.createPayment=(req,res)=>{
    console.log('line 5',req.body)
    try{
        register.findOne({_id:req.params.id,deleteFlag:'false'},(err,datas)=>{
            if(err)throw err
            req.body.userDetails=datas
            const unique = makeId(5)
            const date = Date.now().toString()
            req.body.paymentId = unique + date
            console.log('line 13',req.body.paymentId)
            req.body.paymentOn=new Date().toLocaleString()
                payment.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 14',data)
                        res.status(200).send({message:"successfully payed",data})
                    }
                })
        })
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getAllPaymentList=(req,res)=>{
    try{
        payment.find({deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 29',data)
            res.status(200).send({data:data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSinglePaymentDetails=(req,res)=>{
    try{
        payment.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 41',data)
            res.status(200).send({data:data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.superAdminPackageDetails=(req,res)=>{
    try{
        payment.find({rideStatus:"finish",deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 59',data)
            var datas=(data.price)*(10/100)
            console.log('line 61',datas)
            res.status(200).send(datas)
        })
            // var datas=data.filter((result)=>
            // {
            // if(data.price==70){
            //     console.log('line 63',data.price)
            //     var k=calculateCommission(5)
            //     console.log('line 62',k)
            //     return result
            // }
            // if(data.price>=70&&data.price<=200){
            //     var k= calculateCommission(7)
            //     console.log('line 65',k)
            // }
            // if(data.price<=200&&data.price>=1500){
            //     var k=calculateCommission(10)
            //     console.log('line 70',k)
            // }
            // if(data.price>=2000){
            //     var k=calculateCommission(20)
            //     console.log('line 74',k)
            // }
            //     })
    }catch(err){
         res.status(200).send({message:err.message})
    }
}

// function calculateCommission(commissionPercentage){
//      var calculate=price/100*commissionPercentage
//      console.log('line 76',calculate)
// }