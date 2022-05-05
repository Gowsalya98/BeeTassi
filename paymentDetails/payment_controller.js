const {payment,orderData}=require('./payment_model')
const {userBooking}=require('../userDetails/user_model')
const {makeId}=require('../userDetails/random_string')
const razorpay=require('razorpay')
const res = require('express/lib/response')
const { register } = require('../register/register_model')

exports.createPayment=async(req,res)=>{
    try{
        console.log('line 9',req.body)
        const data=await userBooking.findOne({_id:req.params.userBookingId,deleteFlag:'false'})
        if(data){
            req.body.userDetails=data
            payment.create(req.body,(err,result)=>{
                if(err){res.status(400).send({message:'unsuccessfull payment'})}
                else{
                    console.log('line 16',result)
                    res.status(200).send({message:"successfully payed",result})
                }
            })
        }else{
            res.status(400).send({message:'invalid id'})
        }
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.createPaymentId=async(req,res)=>{

    var instance = new razorpay({ 
        key_id: 'rzp_test_MzrI49KUp5riXp', 
        key_secret: '3L5m9G0173xGRoQTudpISAXa' 
    })

  var options = {
    amount: 100,  
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
      if(err){res.status(200).send({message:'unsuccessfull'})}
      else{
    console.log('line 45',order);
        req.body.paymentId=order.id
        orderData.create(req.body,(err,data)=>{
            if(err)throw err
            res.status(200).send({message:'successfully created your payment Id',data})
        })
   
      }
  });
}

exports.getAllPaymentList=(req,res)=>{
    try{
        payment.find({deleteFlag:'false'},(err,data)=>{
            if(data){
                data.sort().reverse()
                console.log('line 29',data)
                res.status(200).send({data:data})
            }else{
                res.status(400).send({message:'data not found',data:[]})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSinglePaymentDetails=(req,res)=>{
    try{
        payment.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(data){
                console.log('line 41',data)
                res.status(200).send({data:data})
            }else{
                res.status(400).send({message:'data not found',data:[]})
            }
            
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.superAdminPackageDetails=async(req,res)=>{
    try{
      const data=await payment.findOne({paymentId:req.params.paymentId})
            if(data){
                const datas=await userBooking.findOne({_id:req.params.userBookingId,rideStatus:'rideFinish'})
                if(datas){
                console.log('line 94',datas)
                var result=(datas.price)*(10/100)
                console.log('line 96',datas.price)
                console.log('line 97',result)
                res.status(200).send({message:'package send successfull',result})
            }else{
                res.status(400).send({message:'invalid payment id'})  
            }
       }else{
          res.status(400).send({message:'invalid booking id'}) 
       }
        
    }catch(err){
         res.status(200).send({message:err.message})
    }
}
