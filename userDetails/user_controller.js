
const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
//const nodeGeocoder = require('node-geocoder');
const { randomString } = require('./random_string')
const { register,sendOtp} = require('../register/register_model')
const {vehicleDetails}=require('../vehicleDetails/vehicle_model')

exports.userBookingCab= async(req, res) => {
    try{
        const userToken = jwt.decode(req.headers.authorization)
        const id = userToken.userId
        console.log('line 13',req.body)
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            console.log("line 15",data)
                if(data.contact==req.body.contact){
                     const otp = randomString(3)
                                  console.log("otp", otp)
                                  const userDetails=data
                                  sendOtp.create({otp: otp,userDetails:userDetails},async(err, datas) => {
                                      if(err){throw err}
                                      if (datas) {
                                          const lat1=req.body.pickUpLocation.pickUpLatitude
                                          const lon1 =req.body.pickUpLocation.pickUpLongitude
                                          const lat2 = req.body.dropLocation.dropLatitude    //resultData.ropLocation.dropLatitude 
                                          const lon2= req.body.dropLocation.dropLongitude     //resultData.dropLocation.dropLongitude
                                          
                                       const locationOfUser=(locationCalc(lat1,lon1,lat2,lon2).toFixed(1));
                                          req.body.travelDistance=locationOfUser;
                                          console.log('line 30',req.body.travelDistance)
                                          var rate=35;
                                          const count=rate*req.body.travelDistance
                                          req.body.price=count
                                          console.log('line 34',req.body.price)
                                            register.findOneAndUpdate({_id:id},{$set:{travelDistance:req.body.travelDistance,price:req.body.price,selectVehicle:req.body.selectVehicle,pickUpLocation:req.body.pickUpLocation,dropLocation:req.body.dropLocation }},{new:true},async(err,result)=>{
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

exports.getAllUserBookingDetails=(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
        console.log('line 50',id)
        console.log('line 51',ownerToken.userId)
        sendOtp.find({deleteFlag:'false'},{otp:0},(err,data)=>{
            if(err)throw err
            console.log('line 54',data)
            res.status(200).send({message:'user booking Details',data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
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
        res.status(500).send({message:err.message})
    }
}
exports.getAllUserList=(req,res)=>{
    try{
        register.find({typeOfRole:'user',deleteFlag:"false"}, (err, data) => {
            if(err)throw err
                console.log("line 133",data)
                res.status(200).send({ message: data })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSingleUserDetails=(req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        console.log(token)
        const id = token.userId
        console.log('line 144',token.userId)
        console.log('line 145',id)
            register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
                if(err)throw err
                console.log('line 146',data)
                res.status(200).send({message:data})
            })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

    
exports.updateUserProfile=(req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const id = token.userId
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 167',data)
                register.findOneAndUpdate({_id:id},req.body,{new:true},(err,result)=>{
                    if(err)throw err
                    console.log('line 170',result)
                    res.status(200).send({message:'profile update successfully',result})
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


exports.deleteUserProfile=(req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
    const id = token.userId
    console.log("line 184",token.userId)
    console.log("line 185",id)
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 189',data)
                register.findOneAndUpdate({_id:id},{$set:{deleteFlag:true}},{returnOriginal:false},(err,result)=>{
                    if(err)throw err
                    console.log('line 192',result)
                    res.status(200).send({message:'deleted successfully',result})
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}