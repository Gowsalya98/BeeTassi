const {driverDetails}=require('./driver_model')
const {sendOtp,register}=require('../register/register_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')
const nodemailer=require('nodemailer')
const moment=require('moment')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const { userBooking } = require('../userDetails/user_model')

const addDriver=(req,res)=>{
    try{
        console.log('line 8',req.body)
        driverDetails.countDocuments({email:req.body.email }, async (err, num) => {
            console.log('line 10',num)
            if (num == 0) {
                const ownerToken=jwt.decode(req.headers.authorization)
                if(ownerToken!=undefined){
                const id = ownerToken.userId
                    register.findOne({_id:id,deleteFlag:'false'},async(err,datas)=>{
                        if(datas){
                    //  req.body.ownerDetails=datas
                        req.body.ownerId=id
                        const driverPassword=req.body.password
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                    console.log('line 22',req.body.createdAt)
                    driverDetails.create(req.body,(err,data)=>{
                        if(err){throw err}
                         else{
                            postMail( data.email, 'BeeTassi=>your job confirm your login details below here',"email:"+req.body.email+','+"password:"+driverPassword+','+"CabRegisterNumber:"+req.body.carRegNumber)
                            console.log('line 19',data)
                            res.status(200).send({message:"Register successfully,mail send successfully",data})
                        }
                    })
                }else{
                    res.status(200).send({message:"data not found"})
                }
                    })
                }else{
                    res.status(400).send({message:'please provide owner token'})
            } 
            }else{
                res.status(400).send({message:'Data already exists'})
            }
            })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nishagowsalya339@gmail.com',
        pass: '8760167075'
    }
})
const postMail = function ( to, subject, text) {
    return transport.sendMail({
        from: 'nishagowsalya339@gmail.com',
        to: to,
        subject: subject,
        text:text
    })
}
const verifyUserOtp=(req,res)=>{
    try{
        console.log('line 36',req.body.otp)
        sendOtp.findOne({otp:req.body.otp},(err,data)=>{
             if(data){
                console.log('line 39',data)
         userBooking.findById({_id:req.body.userBookingId},(err,datas)=>{
            if(datas){
        userBooking.findOneAndUpdate({_id:req.body.userBookingId},{$set:{rideStatus:'rideStart'}},{new:true},(err,result)=>{
                    if(result){
                        console.log('line 46',result)
                        res.status(200).send({message:'authorized person ride started successfully',result})
                    }else{
                        res.status(400).send({message:'something wrong,please try again'})
                    }
                })
            }else{res.status(200).send({message:'invalid id'})}
        })
            }else{
                res.status(400).send({message:'unauthorized person otp invalid'})  
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const driverUpdateRideStatus=(req,res)=>{
    try{
        console.log('line 62',req.params);
        userBooking.findOne({_id:req.params.userBookingId},(err,datas)=>{
            if(datas){
                console.log('line 65',datas);
        userBooking.findOneAndUpdate({_id:req.params.userBookingId},{$set:{rideStatus:'rideFinish',"cabDetails.cabStatus":'available'}},{new:true},(err,result)=>{
                    if(result){
                        cabDetails.findOneAndUpdate({_id:req.params.cabId},{$set:{cabStatus:'available'}},{new:true},(err,result1)=>{
                        res.status(200).send({message:'your ride should be end successfully',result,result1})
                        })
                    }else{
                        res.status(400).send({message:'something wrong,please try again'})
                    }
                })
            }else{res.status(200).send({message:'invalid id'})}
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const ownerGetOwnDriverCount=async(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        if(ownerToken!=null){
        const data=await driverDetails.aggregate([{$match:{$and:[{typeOfRole:'driver'},{"ownerId":ownerToken.userId},{deleteFlag:"false"}]}}])
        if(data!=null){
            const count=data.length
                res.status(200).send({success:'true',message:'Total Driver',count})
            } else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        res.status(500).send({message:err.message}) 
    }
}
const TotalRideForDriver=async(req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        if(driverToken!=null){
            const data=await userBooking.aggregate([{$match:{$and:[{"cabDetails.driverId":driverToken.userId},{deleteFlag:"false"}]}}])
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'Total Ride for driver',data})
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
const currentDayRideForDriver=async(req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        if(driverToken!=null){
            const data=await userBooking.aggregate([{$match:{$and:[{"cabDetails.driverId":driverToken.userId},{deleteFlag:"false"}]}}])
            if(data!=null){
                const today=moment(new Date()).toISOString().slice(0,10)
                var arr=[]
                data.map((result)=>{
                    if(today==result.createdAt){
                        arr.push(result)
                    }
                })
                res.status(200).send({success:'true',message:'current day Ride for driver',arr})
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
const TotalDriver=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
        const data=await driverDetails.aggregate([{$match:{$and:[{typeOfRole:'driver'},{deleteFlag:"false"}]}}])
        if(data){
            const count=data.length
            if(count!=0){
                res.status(200).send({success:'true',message:'Total Driver',count})
            } else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'failed'})
        }
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const TodayDriver=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
        const newDriver=moment(new Date()).toISOString().slice(0,10)
        console.log('line 131',newDriver)
        const data=await driverDetails.aggregate([{$match:{$and:[{createdAt:newDriver},{typeOfRole:'driver'},{deleteFlag:"false"}]}}])
            if(data){
                const count=data.length
                if(count!=0){
                    res.status(200).send({success:'true',message:'new driver',count})
            } else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
            }else{
                res.status(302).send({success:'false',message:'failed'})
            }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'}) 
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const getAllDriverList=(req,res)=>{
    try{
        driverDetails.find({typeOfRole:"driver",deleteFlag:"false"},(err,data)=>{
            if(data){
                data.sort().reverse()
                console.log('line 58',data)
            res.status(200).send({data:data})
            }else{
            res.status(400).send({message:'your data already deleted',data:[]})
            }
            
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const driverAcceptUserRide=async(req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        if(driverToken!=null){
      const data=await userBooking.findOne({_id:req.params.bookingId,deleteFlag:false})
      console.log('line 131',data)
      if(data){
          console.log('line 133',data.userDetails.email)
          postMail(data.userDetails.email,"Booking Confirmation","congratulations...!,your booking is accepted")
          const datas=await userBooking.findOneAndUpdate({_id:req.params.bookingId},{$set:{rideStatus:"acceptRide","cabDetails.cabStatus":"booked"}},{new:true})
          if(datas){
              console.log('line 137',datas)
              res.status(200).send({message:"driver accept your ride send email successfully",datas})
          }else{
              res.status(400).send({message:"failed",data:[]})
          }
      }else{
          res.status(302).send({message:'invalid id'})
      }
    }else{
        res.status(302).send({message:'invalid driver token'})
    }
    }catch(err){
      res.status(500).send({message:'internal server error'})
    }
  }
  const driverRejectUserRide=async(req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        if(driverToken!=null){
      const data=await userBooking.findOne({_id:req.params.bookingId,deleteFlag:false})
      console.log('line 152',data)
      if(data){
          console.log('line 154',data.userDetails.email)
          postMail(data.userDetails.email,"your booking cancel","oops...!,your booking is rejected")
          const datas=await userBooking.findOneAndUpdate({_id:req.params.bookingId},{$set:{rideStatus:"rejectRide","cabDetails.cabStatus":"available"}},{new:true})
          if(datas){
              console.log('line 158',datas)
              res.status(200).send({message:"driver reject your ride send email successfully",datas})
          }else{
              res.status(400).send({message:"failed",data:[]})
          }
      }else{
          res.status(302).send({message:'invalid id'})
      }
    }else{
        res.status(302).send({message:'invalid driver token'})
    }
    }catch(err){
      res.status(500).send({message:'internal server error'})
    }
  }

const getSingleDriverData=(req,res)=>{
    try{
    if(req.headers.authorization){
        driverDetails.findOne({_id:req.params.id,deleteFlag:"false"},(err,data)=>{
            if(data){
             console.log('line 76',data)
             res.status(200).send({data:data})
            }else{
                res.status(400).send({message:'invalid id',data:[]})
            }
         })
       }else{
           res.status(400).send({message:'unauthorized'})
       }
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const updateDriverProfile=(req,res)=>{
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
}

const deleteDriverProfile=(req,res)=>{
    try{
       if(req.headers.authorization){
        driverDetails.findOne({_id:req.params.id,deleteFlag:"false"},(err,data)=>{
            if(data){
                driverDetails.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:'true'}},{returnOriginal:false},(err,datas)=>{
                    if(datas){
                        console.log('line 116',datas)
                    res.status(200).send({message:"sucessfully deleted your data",datas})
                    }else{
                        res.status(400).send({message:'something wrong your data not updated'})
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
}

module.exports={
    addDriver,
    getAllDriverList,
    getSingleDriverData,
    updateDriverProfile,
    deleteDriverProfile,

    verifyUserOtp,
    driverUpdateRideStatus,
    driverAcceptUserRide,
    driverRejectUserRide,

    TotalRideForDriver,
    currentDayRideForDriver,
    ownerGetOwnDriverCount,
    TotalDriver,
    TodayDriver
  
}