
//const nodemailer = require('nodemailer')
const fast2sms=require('fast-two-sms')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { randomString } = require('../userDetails/random_string')
const { register,sendOtp} = require('../userDetails/register_model')



exports.registerForUser=((req,res)=>{
    try{
        console.log('line 11',req.body)
        register.countDocuments({email:req.body.email},async(err,num)=>{
            if(num==0){
               req.body.password=await bcrypt.hash(req.body.password,10)
                register.create(req.body,(err,data)=>{
                    if(err){throw err}
                    console.log('line 17',data)
                    res.status(200).send({message:'Register successfully',data})
                })
            }else{
                res.status(400).send({message:"email already exists"})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.login=((req,res)=>{
    try{
        console.log('line 33',req.body)
    register.findOne({email:req.body.email},async(err,data)=>{
        if(data){
            if(data.role=='user'){ 
                const userId = data._id
               // req.body.userId=userId
                //console.log("line 38",req.body.userId)
                const token = jwt.sign({ userId }, 'secretKey')
                console.log('token:',token)
            req.body.password = await bcrypt.hash(req.body.password, 10)
                console.log('line 42',data)
                res.status(200).send({message:"login successfull",token,data})
            
            }else{
                res.status(400).send('invalid email')
            }
        }else{
            res.status(400).send('please signup')
        }
       
    })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

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
                                  sendOtp.create({otp: otp,userDetails:userDetails},async(err, datas) => {
                                      if(err){throw err}
                                      console.log("line 91", datas)
                                      if (datas) {
                                          console.log('line 94',datas)
                                        //   req.body.rideStatus='waiting'
                                          register.findOneAndUpdate({_id:id},req.body,{new:true},async(err,result)=>{
                                              if(err)throw err
                                              console.log('line 97',result)
                                            const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                          res.status(200).send({ message: "verification otp send your mobile number",otp,result})
                                        //   setTimeout(() => {
                                        //       sendOtp.findOneAndDelete({ otp: otp }, (err, resultss) => {
                                        //           console.log("line 100", resultss)
                                        //           if (err) { throw err }
                                        //       })
                                        //   }, 60000)
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


exports.getAllUserList=((req,res)=>{
    try{
        register.find({deleteFlag:"false"}, (err, data) => {
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