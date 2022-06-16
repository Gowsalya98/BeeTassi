const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const mongoose=require('mongoose')
const nodeGeocoder = require('node-geocoder');
const {validationResult}=require('express-validator')
const { randomString } = require('./random_string')
const {userBooking,cancelBooking,blockUser}=require('./user_model')
const { register,sendOtp} = require('../register/register_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')


const userBookingCab= async(req, res) => {
    try{
        const errors =validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()})
        }else{
        console.log('line 19',req.body);
        if(req.body!=null){
            const userToken=jwt.decode(req.headers.authorization)
            if(userToken.userId!=null){
                const data1=await cancelBooking.aggregate([{$match:{$and:[{userId:(userToken.userId)},{deleteFlag:'false'}]}}])
                console.log('line 24',data1)
                console.log('line 23',data1.length)
                if(data1.length==0){
                   const data2=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.userId)},{deleteFlag:"false"}]}}])
                        if(data2!=null){
                            req.body.userId=userToken.userId
                            req.body.userDetails=data2[0]
                            const otp = randomString(3)
                            console.log("otp", otp) 
                            const data3=await sendOtp.create({otp: otp,userDetails:req.body.userDetails})
                            console.log('line 32',data3)
                            if (data3!=null) {
                                let options = { provider: 'openstreetmap'}
                                let geoCoder = nodeGeocoder(options);
                                const convertAddressToLatLon=await(geoCoder.geocode(req.body.drop))
                                console.log('line 37',convertAddressToLatLon)
                                                    
                                req.body.dropLocation = {"dropLatitude":convertAddressToLatLon[0].latitude,"dropLongitude":convertAddressToLatLon[0].longitude}
                                console.log('line 40',req.body.dropLocation)
            
                                const d=req.body.dropLocation
                                console.log('line 43',d)
            
                                const lat1=req.body.pickUpLocation.pickUpLatitude
                                console.log('pickUpLatitude:',lat1);
                                const lon1 =req.body.pickUpLocation.pickUpLongitude
                                console.log('pickUpLongitude:',lon1);
            
                                const locationOfUser=locationCalc(lat1,lon1,d.dropLatitude,d.dropLongitude).toFixed(1);
                                req.body.travelDistance=locationOfUser;
                                console.log('line 52',locationOfUser)
                                console.log('line 53',req.body.travelDistance)

                                const data4=await cabDetails.findOne({carRegNumber:req.params.carRegNumber,deleteFlag:'false'})
                                console.log('line 56',data4)
                                if(data4!=null){
                                    req.body.cabDetails=data4
                                    req.body.cabId=data4._id
                                    req.body.perKMPrice=data4.perKMPrice
                                    req.body.serviceAmount=data4.serviceAmount
                                    const count=((data4.perKMPrice)*(req.body.travelDistance/1000))
                                    req.body.price=count+data4.serviceAmount
                                    console.log('line 62',req.body.price)
                                    const data5=await cabDetails.findOneAndUpdate({carRegNumber:req.params.carRegNumber},{$set:{"cabDetails.cabStatus":'booked'}},{new:true})
                                    if(data5!=null){
                                        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                                        console.log('line 66',req.body)
                                        userBooking.create(req.body,async(err,result)=>{
                                            if(result!=null){
                                                console.log('line 72',result)
                                                const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                                res.status(200).send({ message: "verification otp send your mobile number",otp,data:result})
                                            }else{
                                                res.status(400).send({success:'false',message:'failed to booking'})
                                            }
                                        })
                                    }else{res.status(302).send({success:'false',message:"doesn't update cab status"})}
                            
                                }else{
                                    res.status(302).send({success:"false",message:'invalid cab id',data:[]})
                                }
                            }else{
                                res.status(302).send({success:'false',message:"doesn't create otp schema"})
                            }
                        }else{
                            res.status(302).send({success:'false',message:"invalid user id"})
                        }  
                    }                      
                if(data1.length==1){
                    const data2=await register.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(userToken.userId)},{deleteFlag:"false"}]}}])
                         if(data2!=null){
                             req.body.userId=userToken.userId
                             req.body.userDetails=data2
                             const otp = randomString(3)
                             console.log("otp", otp) 
                             const data3=await sendOtp.create({otp: otp,userDetails:req.body.userDetails})
                             console.log('line 100',data3)
                             if (data3!=null) {
                                 let options = { provider: 'openstreetmap'}
                                 let geoCoder = nodeGeocoder(options);
                                 const convertAddressToLatLon=await(geoCoder.geocode(req.body.drop))
                                 console.log('line 105',convertAddressToLatLon)
                                                     
                                 req.body.dropLocation = {"dropLatitude":convertAddressToLatLon[0].latitude,"dropLongitude":convertAddressToLatLon[0].longitude}
                                 console.log('line 108',req.body.dropLocation)
             
                                 const d=req.body.dropLocation
                                 console.log('line 111',d)
             
                                 const lat1=req.body.pickUpLocation.pickUpLatitude
                                 console.log('line 114',lat1);
                                 const lon1 =req.body.pickUpLocation.pickUpLongitude
                                 console.log('line 116',lon1);
             
                                 const locationOfUser=locationCalc(lat1,lon1,d.dropLatitude,d.dropLongitude).toFixed(1);
                                 req.body.travelDistance=locationOfUser;
                                 console.log('line 120',locationOfUser)
                                 console.log('line 121',req.body.travelDistance)
 
                                 const data4=await cabDetails.findOne({carRegNumber:req.params.carRegNumber,deleteFlag:'false'})
                                 console.log('line 124',data4)
                                 if(data4!=null){
                                     req.body.cabDetails=data4
                                     req.body.cabId=data4._id
                                     const count=((data4.perKMPrice)*(req.body.travelDistance/1000))
                                     req.body.serviceAmount=data4.serviceAmount
                                     req.body.penalityAmount=data1[0].penalityAmount
                                     req.body.price=count+data4.serviceAmount+data1[0].penalityAmount
                                     console.log('line 130',req.body.price)
                                     const data5=await cabDetails.findOneAndUpdate({carRegNumber:req.params.carRegNumber},{$set:{"cabDetails.cabStatus":'booked'}},{new:true})
                                     if(data5!=null){
                                         req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                                         console.log('line 134',req.body)
                                         userBooking.create(req.body,async(err,result)=>{
                                             if(result!=null){
                                             const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                             res.status(200).send({ message: "verification otp send your mobile number",otp,data:result})
                                             }else{
                                             res.status(400).send({success:'false',message:'failed to booking'})
                                             }
                                         })
                                     }else{res.status(302).send({success:'false',message:"doesn't update cab status"})}
                             
                                 }else{
                                     res.status(302).send({success:"false",message:'invalid cab id',data:[]})
                                 }
                             }else{
                                 res.status(302).send({success:'false',message:"doesn't create otp schema"})
                             }
                         }else{
                             res.status(302).send({success:'false',message:"invalid user id"})
                         }                            
                      }
                if(data1.length==2){
                   const data2=await register.findOne({_id:userToken.userId},{deleteFlag:'false'})
                   if(data2!=null){
                        const data3=await register.findOneAndUpdate({_id:userToken.userId},{$set:{userStatus:'inactive'}},{new:true})
                        console.log('line 161',data3)
                        if(data3!=null){
                            req.body.blockedUser=data3
                            const data4=await blockUser.create(req.body)
                            console.log('line 164',data4)
                            res.status(200).send({success:'true',message:'your account is blocked',data:data4})
                        }else{
                            res.status(302).send({success:'false',message:'does not blocked your account'})
                        }
                   }else{
                       res.status(302).send({success:'false',message:'data not found'})
                   }
                }
            }else{
                res.status(302).send({success:'false',message:'unauthorized'})
            }
        }else{res.status(400).send('please provide valid details')}
    }  
}catch(err){
    console.log(err)
    res.status(500).send({message:'internal server err'})
}
}
function locationCalc(lat1, lon1,latitude,longitude) 
{
      var R =  6371;
      var lat1 = toRad(lat1);
      var lat2 = toRad(latitude);
      var dLat = toRad(latitude-lat1);
      var dLon = toRad(longitude-lon1); 
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(latitude);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var resultOfMeters= R * c;
      console.log('resultOfMeters',Math.floor(resultOfMeters))
      return Math.floor(resultOfMeters);
}
// Converts numeric degrees to radians
function toRad(Value) 
    {return Value * Math.PI / 180;}

const userCancelForCab=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            if(req.params.bookingId.length==24){
                const data1=await userBooking.findOne({_id:req.params.bookingId,deleteFlag:"false"})
                if(data1!=null){
                    console.log('line 192',data1)
                    const data2=await userBooking.findOneAndUpdate({_id:req.params.bookingId},{$set:{rideStatus:'cancelBooking',"cabDetails.cabStatus":'available'}},{new:true})
                    if(data2!=null){
                        console.log('line 195',data2)
                        req.body.userId=userToken.userId
                        req.body.userBooking=data2
                        req.body.penalityAmount=data2.price/2
                        console.log('line 199',req.body.penalityAmount)
                        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                        const data3=await cancelBooking.create(req.body)
                        if(data3!=null){
                            console.log('line 203',data3)
                            res.status(200).send({success:'true',message:'your booking cancel successfully',data:data3})
                        }else{
                            res.status(400).send({success:'false',message:'failed to cancel to our booking'})
                        }
                    }else{
                        res.status(302).send({success:'false',message:'does not update ride details'})
                    }
                }else{
                    res.status(302).send({success:'false',message:'data not found'})
                }
            }else{
                res.status(302).send({success:'false',message:'invalid booking id'})
            } 
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const userGetOurcancelBookingHistory=async(req,res)=>{
    try{
        const userToken=jwt.decode(req.headers.authorization)
        if(userToken!=null){
            const data=await cancelBooking.aggregate([{$match:{$and:[{"userId":(userToken.userId)},{"userBooking.rideStatus":'cancelBooking'},{deleteFlag:"false"}]}}])
            console.log('line 230',data)
            if(data.length!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'your cancel details',data:data})
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
const userGetOurOwnBookingHistory=async(req,res)=>{
     try{
         const userToken=jwt.decode(req.headers.authorization)
         const id=userToken.userId
         if(id!=null){
             const data=await userBooking.aggregate([{$match:{$and:[{"userId":(id)},{deleteFlag:'false'}]}}])
             if(data.length!=0){
                 data.sort().reverse()
                res.status(200).send({success:'true',message:'your booking history',data:data})
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
 const userGetOurPreviousBookingHistory=async(req,res)=>{
     try{
         const userToken=jwt.decode(req.headers.authorization)
         if(userToken!=null){
        const data=await userBooking.aggregate([{$match:{$and:[{rideStatus:'rideFinish'},{deleteFlag:'false'}]}}])
        if(data!=null){
            console.log('line 156',data)
            const currantDate=moment(new Date()).toISOString().slice(0,10)
            var arr=[]
            for(i=0;i<data.length;i++){
               if(data[i].selectDate<currantDate){
                   console.log('line 160',data)
                    arr.push(data[i])
              }
               }
            console.log('.....',arr)
            res.status(200).send({success:'true',message:'previous ride details',data})
        }else{
            res.status(302).send({success:'false',message:'failed'})
        }
    }else{
        res.status(302).send({success:'false',message:'unauthorized'})
    }
     }catch(err){
        res.status(500).send({message:'internal server error'})
     }
 }
const getAllUserBookingDetails=async(req,res)=>{
    try{
       if(req.headers.authorization){
        const data=await userBooking.find({deleteFlag:'false'})
            if(data){
                data.sort().reverse()
                console.log('line 96',data)
                res.status(200).send({message:'user booking Details',data})
            }else{
                res.status(302).send({success:'false',message:'data not exists',data:[]})
            }
       }else{
           res.status(400).send({success:'false',message:'unauthorized'})
       }
       
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const getAllCancelBooking=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await cancelBooking.find({deleteFlag:'false'})
            if(data!=null){
                data.sort().reverse()
                res.status(200).send({success:'true',message:'All cancel booking',data:data})
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
const getAllPendingBookingDetails=async(req,res)=>{
    try{
        const data=await userBooking.aggregate([{$match:{$and:[{rideStatus:'pending'},{deleteFlag:"false"}]}}])
        if(data){
            data.sort().reverse()
            res.status(200).send({success:'true',message:'pending booking details',data:data})
        }else{
            res.status(302).send({success:'false',message:'data not found',data:[]})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const getSingleUserBookingDetails=async(req,res)=>{
    try{
        if(req.headers.authorization){
         const data=await userBooking.findOne({_id:req.params.userBookingId,deleteFlag:'false'})
             if(data){
                 console.log('line 96',data)
                 res.status(200).send({message:'your booking data',data})
             }else{
                 res.status(302).send({success:'false',message:'data not exists',data:[]})
             }
        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }
        
     }catch(err){
         res.status(500).send({success:'false',message:'internal server error'})
     }
}

const userSearch=async(req,res)=>{
    try{
        const data=await cabDetails.find({
            "$or":
                [{ "cabDetails.carModel": { $regex: req.params.key } },
                { "cabDetails.numberOfSeats": { $regex: req.params.key } }
                ]
        })
        console.log('line 134',data);
        res.status(200).send({ message: "search done", data })
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
const createUserprofileAccountDetails=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
                const id=token.userId
        const result=await register.findById({_id:id,deleteFlag:'false'})
        if(result.typeOfRole=='user'){
                req.body.firstName=result.name
        const data=await register.findByIdAndUpdate({_id:id,deleteFlag:'false'},req.body,{new:true})
               if (data) {
                res.status(200).send({ success:'true',message:'your profile save',data:data });
              } else {
                res.status(302).send({ success:'false',message:'invalid token' });
              }
            }else{
                res.status(302).send({success:'false',message:'invaild id'})
            }
    }catch(err){
        console.log(err);
        res.status(500).send({message:'internal server error'})
    }
}
const TotalRide=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
        const data=await userBooking.aggregate([{$match:{$and:[{rideStatus:"rideFinish"},{deleteFlag:'false'}]}}])
            if(data){
                const count=data.length
                if(count!=0){
                    res.status(200).send({success:'true',message:'Total ride',count})
            } else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
            }else{
                res.status(302).send({success:'false',message:'failed'})
            }
        }else{
            res.status(302).send({message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}

const TodayRide=async(req,res)=>{
    try{
        const adminToken=jwt.decode(req.headers.authorization)
        if(adminToken!=null){
        const newRide=moment(new Date()).toISOString().slice(0,10)
        const data=await userBooking.aggregate([{$match:{$and:[{rideStatus:"rideFinish"},{createdAt:newRide},{deleteFlag:'false'}]}}])
            if(data){
                const count=data.length
                if(count!=0){
                    res.status(200).send({success:'true',message:'Today ride',count})
            } else{
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }
            }else{
                res.status(302).send({success:'false',message:'failed'})
            }
        }else{
            res.status(302).send({message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:'internal server error'}) 
    }
}
const getAllUserList=async(req,res)=>{
    try{
       const data= await register.aggregate([{$match:{$and:[{typeOfRole:"user",deleteFlag:"false"}]}}])
            if(data){
                data.sort().reverse()
                console.log("line 128",data)
                res.status(200).send({ success:'true',message: 'successfull',data:data })
            }else{ 
                res.status(302).send({ success:'false',message: 'data not exists',data:[]})      
                    }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const getSingleUserDetails=(req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const id = token.userId
            register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
                if(data){
                console.log('line 144',data)
                res.status(200).send({ success:'true',message: 'successfull',data:data })
                }else{
                    res.status(302).send({ success:'false',message: 'data not exists',data:[]})
                }
            })
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

    
const updateUserProfile=async(req,res)=>{
    try{
            const token=jwt.decode(req.headers.authorization)
                const id=token.userId
        let data=await register.findByIdAndUpdate({_id:id,deleteFlag:'false'},req.body,{new:true})
               if (data) {
                res.status(200).send({ success:'true',message:'update user profile successfully',data: data });
              } else {
                res.status(302).send({ success:'false',message:'invalid token' });
              }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const deleteUserProfile=(req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const id = token.userId
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(data){
                register.findOneAndUpdate({_id:id},{$set:{deleteFlag:true}},{returnOriginal:false},(err,result)=>{
                    if(err)throw err
                    console.log('line 192',result)
                    res.status(200).send({message:'deleted successfully',result})
                })
            }else{
                res.status(400).send({message:'invalid token'})   
            }
        })
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

// const cabBooking=(req,res)=>{
//     // try{
//     //     console.log('line 12',req.body);
//     //     const userToken=jwt.decode(req.headers.authorization)
//     //     const id=userToken.userId
//     //     register.findOne({_id:id,deleteFlag:"false"},(err,data1)=>{
//     //             if(data1){
//     //                 console.log('line 18',data1)
//     //                 req.body.userId=userToken.userId
//     //                 req.body.userDetails=data1
//     //                 userBooking.create(req.body,(err,data2)=>{
//     //                     if(data2){
//     //                         console.log('line 21',data2)
//     //                         res.status(200).send({success:'true',message:'successfull',data:data2})
//     //                     }else{
//     //                         res.status(302).send({message:'failed',data:[]})
//     //                     }
//     //                 })
//     //             }else{
//     //                 res.status(302).send({message:'invalid id',data:[]})
//     //             }
//     //         })
//     // }catch(err){
//     //     console.log(err)
//     //     res.status(500).send({message:'internal server error'})
//     // }
// }


module.exports={
    //cabBooking,
    userBookingCab,
    userCancelForCab,
    getAllUserBookingDetails,
    getAllCancelBooking,
    getSingleUserBookingDetails,
    userGetOurPreviousBookingHistory,
    userGetOurOwnBookingHistory,
    getAllPendingBookingDetails,
    userGetOurcancelBookingHistory,
    

    TotalRide,
    TodayRide,
    createUserprofileAccountDetails,
    getAllUserList,
    getSingleUserDetails,
    updateUserProfile,
    deleteUserProfile,
    userSearch
}
   