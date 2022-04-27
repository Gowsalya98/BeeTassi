const {driverDetails}=require('./driver_model')
const {sendOtp}=require('../register/register_model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const { userBooking } = require('../userDetails/user_model')

exports.addDriver=((req,res)=>{
    try{
        console.log('line 8',req.body)
        driverDetails.countDocuments({email:req.body.email }, async (err, num) => {
            console.log('line 10',num)
            if (num == 0) {
                const ownerToken=jwt.decode(req.headers.authorization)
                const id = ownerToken.userId
                req.body.driverId=id
                req.body.password = await bcrypt.hash(req.body.password, 10)
                driverDetails.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 19',data)
                        res.status(200).send({message:"Register successfully",data})
                    }
                })
            }else{
                res.status(400).send({message:'Data already exists'})
            }
            })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})


exports.verifyUserOtp=(req,res)=>{
    try{
        console.log('line 36',req.params.otp)
        sendOtp.findOne({otp:req.params.otp},(err,data)=>{
             if(data){
                console.log('line 39',data)
         userBooking.findById({_id:req.params.userBookingId},(err,datas)=>{
            if(datas){
        userBooking.findOneAndUpdate({_id:req.params.userBookingId},{$set:{rideStatus:'rideStart'}},{new:true},(err,result)=>{
                    if(result){
                        console.log('line 46',result)
                        res.status(200).send({message:'authorized person ride started successfully',result})
                    }else{
                        res.status(400).send({message:'something wrong,please try again'})
                    }
                })
            }else{res.status(200).send({message:'unauthorized person otp invalid'})}
        })
            }else{
                res.status(400).send({message:'unauthorized person otp invalid'})  
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
exports.getAllDriverList=((req,res)=>{
    try{
        driverDetails.find({typeOfRole:"driver",deleteFlag:"false"},(err,data)=>{
            if(data){
                console.log('line 58',data)
            res.status(200).send({data:data})
            }else{
            res.status(400).send({message:'your data already deleted'})
            }
            
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.getSingleDriverData=((req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        const id=driverToken.userId
        driverDetails.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
           if(data){
            console.log('line 76',data)
            res.status(200).send({data:data})
           }else{
               res.status(400).send({message:'invalid token'})
           }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.updateDriverProfile=((req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        const id=driverToken.userId
        driverDetails.findOne({_id:id,deleteFlag:'false'},(err,data)=>{
           if(data){
            console.log('line 93',data)
            driverDetails.findOneAndUpdate({_id:id},req.body,{new:true},(err,datas)=>{
                if(datas){
                console.log('line 96',datas)
                res.status(200).send({message:'update successfully',datas})
                }else{
                    res.status(400).send({message:'someyhing wrong your data not updated'})}
            })
        }else{ res.status(400).send({message:'invalid token'})}
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.deleteDriverProfile=((req,res)=>{
    try{
       if(req.headers.authorization){
        driverDetails.findOne({_id:req.params.id,deleteFlag:"false"},(err,data)=>{
            if(data){
                driverDetails.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:'true'}},{returnOriginal:false},(err,datas)=>{
                    if(datas){
                        console.log('line 116',datas)
                    res.status(200).send({message:"sucessfully deleted your data",datas})
                    }else{
                        res.status(400).send({message:'someyhing wrong your data not updated'})
                    }   
                })
            }else{
                res.status(400).send({message:'invalid id'}) 
            }    
        })
       }else{
        res.status(400).send({message:'invalid token'}) 
       }
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
})