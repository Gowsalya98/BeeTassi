const {payment,orderData}=require('./payment_model')
const {userBooking}=require('../userDetails/user_model')
const {makeId}=require('../userDetails/random_string')
const { register } = require('../register/register_model')
const razorpay=require('razorpay')
const jwt=require('jsonwebtoken')
const moment=require('moment')

const createPayment=async(req,res)=>{ 
    try{
        console.log('line 9',req.body)
        const data=await userBooking.findOne({_id:req.params.userBookingId,deleteFlag:'false'})
        if(data){
            req.body.user=data
            req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                console.log('line 15',req.body.createdAt)
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

const createPaymentId=async(req,res)=>{

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

const getAllPaymentList=(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
        payment.find({deleteFlag:'false'},(err,data)=>{
            if(data){
                data.sort().reverse()
                console.log('line 29',data)
                res.status(200).send({data:data})
            }else{
                res.status(400).send({message:'data not found',data:[]})
            }
        })
    }else{
        res.status(302).send({message:'unauthorized'})
    }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getSinglePaymentDetails=(req,res)=>{
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

const superAdminPackageDetails=async(req,res)=>{
    try{
      const data=await payment.findOne({paymentId:req.params.paymentId})
            if(data){
                console.log('line 94',data)
                const datas=await userBooking.findOne({_id:req.params.userBookingId,rideStatus:'rideFinish'})
                if(datas){
                console.log('line 94',datas)
                var result=(datas.price)*(10/100)
                console.log('line 96',datas.price)
                console.log('line 97',result)
                res.status(200).send({message:'package send successfull',result})
            }else{
                res.status(400).send({message:'invalid user booking id'})  
            }
       }else{
          res.status(400).send({message:'invalid order id'}) 
       }
        
    }catch(err){
         res.status(200).send({message:err.message})
    }
}

const userGetOurOwnPaymentDetails=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
         const id=userToken.userId
         console.log('id',id)
         if(id!=null){
             const data=await payment.aggregate([{$match:{"user.userId":id}}])
                console.log('line 122',data)
             if(data.length!=0){
                res.status(200).send({success:'true',message:'your payment history',data:data})
             }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
             }
         }else{
            res.status(400).send({success:'false',message:'invalid token'})
         }
     }catch(err){
         console.log(err)
         res.status(500).send({message:'internal server error'})
     }
}

const ownerGetOurOwnPaymentDetails=async(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
         const id=ownerToken.userId
         if(id!=null){
             const data=await payment.aggregate([{$match:{"user.cabDetails.cabOwnerId":id}}])
             console.log('line 144',data)
             if(data.length!=0){
                res.status(200).send({success:'true',message:'owner view payment history',data:data})
             }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
             }
         }else{
            res.status(400).send({success:'false',message:'invalid token'})
         }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const ownerGetOwnPaymentCount=async(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        if(ownerToken!=null){
            const data=await payment.aggregate([{$match:{"user.cabDetails.cabOwnerId":ownerToken.userId}},{$group:{"_id":null,"TotalPayout":{$sum:"$amount"}}}])
            if(data!=null){
                res.status(200).send({success:'true',message:'owner get own total payment',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const driverGetOwnTotalPayouts=async(req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        if(driverToken!=null){
            const data=await payment.aggregate([{$match:{"user.cabDetails.driverId":driverToken.userId}}])
            if(data!=null){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'driver own payment details',data:data})
            }else{
                res.status(302).send({success:'false',message:'data not found'})   
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const driverGetOwnTodayPayouts=async(req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        if(driverToken!=null){
            const data=await payment.aggregate([{$match:{"user.cabDetails.driverId":driverToken.userId}}])
            if(data!=null){
                const today=moment(new Date()).toISOString().slice(0,10)
                var arr=[]
                data.map((result)=>{
                    if(today==result.createdAt){
                        arr.push(result)
                    }
                })
                res.status(200).send({success:'true',message:'driver own payment details',data:arr})
            }else{
                res.status(302).send({success:'false',message:'data not found'})      
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})  
        }
    }catch(err){
        res.status(500).send({message:'internal server error'}) 
    }
}
const TotalEarning=async(req,res)=>{
    console.log('hai');
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
        const data=await payment.aggregate([{$group:{"_id":null,"TotalEarnings":{$sum:"$amount"}}}])
            console.log('line 162',data)
            if(data!=null){
                console.log('....',data)
                res.status(200).send({success:'true',message:'Total Earnings',data})
            }else{
                res.status(400).send({success:'false',message:'unauthorized'})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'}) 
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}

const TodayEarning=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
        const newEarning=moment(new Date()).toISOString().slice(0,10)
        console.log('date:',newEarning)
        const data=await payment.aggregate([{$match:{createdAt:newEarning}},{$group:{"_id":null,"TodayEarnings":{$sum:"$amount"}}}])
            console.log('line 179',data)
            if(data){
                console.log('....',data)
                res.status(200).send({success:'true',message:'Today Earnings',data})
            }else{
                res.status(400).send({success:'false',message:'failed'})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})  
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    createPaymentId,
    createPayment,
    getAllPaymentList,
    getSinglePaymentDetails,
    superAdminPackageDetails,
    
    TotalEarning,
    TodayEarning,
    ownerGetOwnPaymentCount,

    driverGetOwnTotalPayouts,
    driverGetOwnTodayPayouts,
    userGetOurOwnPaymentDetails,
    ownerGetOurOwnPaymentDetails
}