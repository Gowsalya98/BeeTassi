const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
const moment=require('moment')
const mongoose=require('mongoose')
const nodeGeocoder = require('node-geocoder');
const { randomString } = require('./random_string')
const {userBooking}=require('./user_model')
const { register,sendOtp} = require('../register/register_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')


const cabBooking=(req,res)=>{
    // try{
    //     console.log('line 12',req.body);
    //     const userToken=jwt.decode(req.headers.authorization)
    //     const id=userToken.userId
    //     register.findOne({_id:id,deleteFlag:"false"},(err,data1)=>{
    //             if(data1){
    //                 console.log('line 18',data1)
    //                 req.body.userId=userToken.userId
    //                 req.body.userDetails=data1
    //                 userBooking.create(req.body,(err,data2)=>{
    //                     if(data2){
    //                         console.log('line 21',data2)
    //                         res.status(200).send({success:'true',message:'successfull',data:data2})
    //                     }else{
    //                         res.status(302).send({message:'failed',data:[]})
    //                     }
    //                 })
    //             }else{
    //                 res.status(302).send({message:'invalid id',data:[]})
    //             }
    //         })
    // }catch(err){
    //     console.log(err)
    //     res.status(500).send({message:'internal server error'})
    // }
}

const userBookingCab= async(req, res) => {
    try{
        console.log('line 40',req.body);
        if(req.body!=null){
        const userToken=jwt.decode(req.headers.authorization)
        const id=userToken.userId
        register.findOne({_id:id,deleteFlag:"false"},(err,data1)=>{
                if(data1){
                             req.body.userId=userToken.userId
                                 req.body.userDetails=data1
                                    const otp = randomString(3)
                                 console.log("otp", otp)
                                 
                        sendOtp.create({otp: otp,userDetails:req.body.userDetails},async(err, datas) => {
                                 if (datas) {
                                        let options = { provider: 'openstreetmap'}
                                        let geoCoder = nodeGeocoder(options);
                                        const convertAddressToLatLon=await(geoCoder.geocode(req.body.drop))
                                        console.log('line 25',convertAddressToLatLon)
                                        
                                        req.body.dropLocation = {"dropLatitude":convertAddressToLatLon[0].latitude,"dropLongitude":convertAddressToLatLon[0].longitude}
                                        console.log('line 28',req.body.dropLocation)

                                        const d=req.body.dropLocation
                                        console.log('line 31',d)

                                          const lat1=req.body.pickUpLocation.pickUpLatitude
                                          console.log('line 33',lat1);
                                          const lon1 =req.body.pickUpLocation.pickUpLongitude
                                          console.log('line 35',lon1);

                                       const locationOfUser=locationCalc(lat1,lon1,d.dropLatitude,d.dropLongitude).toFixed(1);
                                          req.body.travelDistance=locationOfUser;
                                          console.log('line 41',locationOfUser)
                                          console.log('line 39',req.body.travelDistance)
                            cabDetails.findOne({_id:req.params.cabId,deleteFlag:'false'},async(err,cab)=>{
                            if(cab){
                                console.log('line 75',cab)
                                req.body.cabDetails=cab
                                    req.body.cabId=cab._id
                                          const count=cab.perKMPrice*req.body.travelDistance
                                          req.body.price=count
                                          console.log('line 43',req.body.price)
                                          req.body.createdAt=moment(new Date()).toISOString().slice(0,9)
                                          console.log('line 48',req.body)
                                userBooking.create(req.body,async(err,result)=>{
                                        if(result){
                            const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                            res.status(200).send({ message: "verification otp send your mobile number",otp,result:result})
                                        }else{
                                            res.status(302).send({success:'false',message:'failed to booking'})
                                        }
                            })
                        }else{
                            res.status(302).send({success:"false",message:'failed',data:[]})
                        }
                    }) 
                }else{
                    res.status(302).send({success:'false',message:"does not create"})
                }  
            })                           
             }else{
                 res.status(400).send('please provide valid token')
             }
            
        })
    }else{res.status(400).send('something error please check it')}
   
}catch(err){
    res.status(500).send({message:err.message})
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
      var resultOfKM= R * c;
      console.log('resultOfKM',Math.floor(resultOfKM))
      return Math.floor(resultOfKM);
    }

    // Converts numeric degrees to radians
function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

const userGetOurOwnBookingHistory=async(req,res)=>{
     try{
         const userToken=jwt.decode(req.headers.authorization)
         const id=userToken.userId
         if(id!=null){
             const data=await userBooking.aggregate([{$match:{$and:[{"userId":(id)},{deleteFlag:'false'}]}}])
             if(data.length!=0){
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
const getAllUserBookingDetails=async(req,res)=>{
    try{
       if(req.headers.authorization){
        const data=await userBooking.find({})
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
const getAllPendingBookingDetails=async(req,res)=>{
    try{
        const data=await userBooking.aggregate([{$match:{$and:[{rideStatus:'available'},{deleteFlag:false}]}}])
        if(data){
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
         const data=await userBooking.findOne({_id:req.params.userBookingId})
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


module.exports={
    cabBooking,userBookingCab,getAllUserBookingDetails,getSingleUserBookingDetails,
    userSearch,createUserprofileAccountDetails,getAllUserList,getSingleUserDetails,
    updateUserProfile,deleteUserProfile,userGetOurOwnBookingHistory,getAllPendingBookingDetails
}