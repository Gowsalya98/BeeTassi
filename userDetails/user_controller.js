
const fast2sms=require('fast-two-sms')
const jwt=require('jsonwebtoken')
const { randomString } = require('./random_string')
const { register,sendOtp} = require('../register/register_model')

exports.userBookingCab= ((req, res) => {
    try{
        const userToken = jwt.decode(req.headers.authorization)
        const id = userToken.userId
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            console.log("line 65",data)
                if(data.contact==req.body.contact){
                     const otp = randomString(3)
                                  console.log("otp", otp)
                                  const userDetails=data
                                  console.log('line 72',userDetails)
                                  sendOtp.create({otp: otp,userDetails:userDetails},async(err, datas) => {
                                      if(err){throw err}
                                      console.log("line 91", datas)
                                      if (datas) {
                                          console.log('line 94',datas)
                                          register.findOneAndUpdate({_id:id},req.body,{new:true},async(err,result)=>{
                                              if(err)throw err
                                              console.log('line 97',result)
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
})

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