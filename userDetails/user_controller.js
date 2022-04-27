
const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
//const nodeGeocoder = require('node-geocoder');
const { randomString } = require('./random_string')
const {userBooking}=require('./user_model')
const { register,sendOtp} = require('../register/register_model')
const {vehicleDetails}=require('../vehicleDetails/vehicle_model')

exports.userBookingCab= async(req, res) => {
    try{
         console.log('line 13',req.body)
        register.findOne({_id:req.params.id,deleteFlag:"false"},(err,data)=>{
            console.log("line 15",data)
                if(data.contact==req.body.contact){
                     const otp = randomString(3)
                                  console.log("otp", otp)
                                  const userDetails=data
                                  sendOtp.create({otp: otp,userDetails:userDetails},async(err, datas) => {
                                      if(err){throw err}
                                      if (datas) {
                                          const lat1=req.body.pickUpLocation.pickUpLatitude
                                          console.log('line 22',lat1);
                                          const lon1 =req.body.pickUpLocation.pickUpLongitude
                                          console.log('line 24',lon1);
                                          const lat2 = req.body.dropLocation.dropLatitude    //resultData.ropLocation.dropLatitude 
                                          console.log('line 26',lat2);
                                          const lon2= req.body.dropLocation.dropLongitude     //resultData.dropLocation.dropLongitude
                                          console.log('line 28',lon2);
                                          
                                       const locationOfUser=(locationCalc(lat1,lon1,lat2,lon2).toFixed(1));
                                          req.body.travelDistance=locationOfUser;
                                          console.log('line 30',req.body.travelDistance)
                                          var rate=35;
                                          const count=rate*req.body.travelDistance
                                          req.body.price=count
                                          console.log('line 34',req.body.price)
                                            
                                          var startLocation={}
                                            startLocation.pickUpLatitude=req.body.pickUpLocation.pickUpLatitude
                                            startLocation.pickUpLongitude=req.body.pickUpLocation.pickUpLongitude
                                                req.body.pickUpLocation=startLocation

                                            var endLocation={}
                                            endLocation.dropLatitude=req.body.dropLocation.dropLatitude
                                            endLocation.dropLongitude=req.body.dropLocation.dropLongitude 
                                                req.body.dropLocation=endLocation
                                               req.body.userDetails=data
                                            userBooking.create(req.body,async(err,result)=>{
                                                if(err)throw err
                                                console.log('line 61',result)
                                        const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                            res.status(200).send({ message: "verification otp send your mobile number",otp,result})
                                            })
                                      }else{
                                          res.status(400).send('something wrong')
                                      }
                                     })             
             }else{
                 res.status(400).send('please check your contact number')
             }
            
        })
   
   
}catch(err){
    res.status(500).send({message:err.message})
}
}
   
    function locationCalc(lat1, lon1, lat2, lon2) 
    {
      var R =  6371;
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1); 
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
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

exports.getAllUserBookingDetails=async(req,res)=>{
    try{
       if(req.headers.authorization){
        const data=await userBooking.find({})
            if(data){
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

exports.userSearch=async(req,res)=>{
    try{
        const data=await vehicleDetails.find({
            "$or":
                [{ "vehicleDetails.vehicleType": { $regex: req.params.key } },
                { "vehicleDetails.vehicleNumber": { $regex: req.params.key } }
                ]
        })
        console.log('line 134',data);
        res.status(200).send({ message: "search done", data })
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
exports.getAllUserList=async(req,res)=>{
    try{
       const data= await register.aggregate([{$match:{$and:[{typeOfRole:"user",deleteFlag:"false"}]}}])
            if(data){
                console.log("line 128",data)
                res.status(200).send({ success:'true',message: 'successfull',data:data })
            }else{ 
                res.status(302).send({ success:'false',message: 'data not exists',data:[]})      
                    }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

exports.getSingleUserDetails=(req,res)=>{
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

    
exports.updateUserProfile=async(req,res)=>{
    try{
       if(req.headers.authorization){
           if(req.params.userId.length==24){
               let data=await register.findByIdAndUpdate({_id:req.params.userId},{$set:req.body},{new:true})
               if (data) {
                res.status(200).send({ success:'true',message:'update user profile successfully',data: data });
              } else {
                res.status(302).send({ success:'false',data: [] });
              }
            } else {
              res.status(200).send({ message: "please provide a valid id" });
            }
          }else{
            res.status(400).send({ message: "unauthorized" });
          }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}


exports.deleteUserProfile=(req,res)=>{
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