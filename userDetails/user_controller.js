
const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
const nodeGeocoder = require('node-geocoder');
const { randomString } = require('./random_string')
const { register,sendOtp} = require('../register/register_model')

exports.userBookingCab= (async(req, res) => {
    try{
        const userToken = jwt.decode(req.headers.authorization)
        const id = userToken.userId
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            console.log("line 13",data)
                if(data.contact==req.body.contact){
                     const otp = randomString(3)
                                  console.log("otp", otp)
                                  const userDetails=data
                                  console.log('line 18',userDetails)
                                  sendOtp.create({otp: otp,userDetails:userDetails},async(err, datas) => {
                                      if(err){throw err}
                                      console.log("line 21", datas)
                                      if (datas) {
                                          console.log('line 24',datas)
                                       let options = { provider: 'openstreetmap' }
                                    let geoCoder = nodeGeocoder(options);

                                    const convertAddressToLatLon=await(geoCoder.geocode(req.body.dropLocation))
                                    console.log('line 28',convertAddressToLatLon)
                                        register.findOne({_id:id,deleteFlag:"false"},(err,resultData)=>{
                                            if(err)throw err
                                            console.log('line 31',resultData)

                                            resultData.dropLocation.dropLatitude=convertAddressToLatLon[0].latitude
                                            console.log('line 34',resultData.dropLocation.dropLatitude)

                                            resultData.dropLocation.dropLongitude=convertAddressToLatLon[0].longitude  
                                            console.log('line 37',resultData.dropLocation.dropLongitude)

                                          const lat1=req.body.pickUpLocation.pickUpLatitude
                                          console.log('line 40',lat1);

                                          const lon1 =req.body.pickUpLocation.pickUpLongitude
                                          console.log('line 43',lon1);

                                          const lat2 = resultData.dropLocation.dropLatitude
                                          console.log('line 46',lat2);

                                          const lon2= resultData.dropLocation.dropLongitude
                                          console.log('line 49',lon2);

                                       const locationOfUser=(locationCalc(lat1,lon1,lat2,lon2).toFixed(1));
                                          req.body.travelDistance=locationOfUser;
                                          console.log('line 53',req.body.travelDistance)
                                          var rate=10;
                                          const count=rate*req.body.travelDistance
                                          req.body.price=count
                                          console.log('line 57',req.body.price)

                                          register.findOneAndUpdate({_id:id},req.body,{new:true},async(err,result)=>{
                                              if(err)throw err
                                              console.log('line 61',result)
                                            const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                          res.status(200).send({ message: "verification otp send your mobile number",otp,result})
                                          })
                                          

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
})
   
    function locationCalc(lat1, lon1, lat2, lon2) 
    {
      var R =  6371;
      var lat1 = toRad(lat1);
      console.log('line 82',lat1) 
      var lat2 = toRad(lat2);
      console.log('line 84',lat2) 
      var dLat = toRad(lat2-lat1);
      console.log('line 86',dLat) 
      var dLon = toRad(lon2-lon1);
      console.log('line 88',dLon) 
    
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        console.log('line 92',a) 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      console.log('line 94',c)
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


exports.getAllUserList=((req,res)=>{
    try{
        register.find({typeOfRole:'user',deleteFlag:"false"}, (err, data) => {
            if(err)throw err
                console.log("line 133",data)
                res.status(200).send({ message: data })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.getSingleUserDetails=((req,res)=>{
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
})

    
exports.updateUserProfile=((req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
    const id = token.userId
    console.log("line 162",token.userId)
    console.log("line 163",id)
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
})


exports.deleteUserProfile=((req,res)=>{
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
})