const {payment}=require('./payment_model')
const {register}=require('../register/register_model')
const {makeId}=require('../userDetails/random_string')

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
