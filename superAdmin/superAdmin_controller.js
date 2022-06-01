const {superadmin,sendOtp} = require('./superAdmin_model')
const {randomString}=require('../userDetails/random_string')
const {register}=require('../register/register_model')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')

exports.superAdminRegister = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() })
        } else {
            superadmin.findOne({ email: req.body.email }, async (err, data) => {
                console.log(data)
                if (data == null) {
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    superadmin.create(req.body, (err, data) => {
                        if (err) throw err
                        console.log(data)
                        res.status(200).send({ message: "Successfully Registered", data })
                    })
                } else {
                    res.status(400).send({ message: "This Email already Exists" })
                }
            })
        }
    } catch (err) {
        res.status(500).send({ success:'false',message:'internal server error' })
    }
}

exports.superAdminLogin = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log(err)
            return res.status(400).send({ errors: errors.array() })
        } else {
            console.log('line 41',req.body);
            superadmin.findOne({ email: req.body.email }, async (err, data) => {
              if(data){
                  console.log('line 44',data);
                    const password = await bcrypt.compare(req.body.password, data.password)
                    if (password == true) {
                        const userid = data._id
                        const token = jwt.sign({ userid }, 'secretKey')
                        console.log('line 45',data)
                        res.status(200).send({ message: "Login Successfully", token,data })
                    } else {
                        res.status(400).send({ message: "Incorrect Password" })
                    }
                }else{
                    res.status(400).send({ message: "invalid email & password" })
                }

            })
        }
    } catch (err) {
        res.status(500).send({ success:'false',message:'internal server error'})
    }
}

exports.forgetPassword=(req,res)=>{
    console.log('line 64',req.body.email)
    console.log('line 67',req.body.contact)
    try{
        //  console.log('hai');
        if (req.body.otp != null) {
            sendOtp.findOne({ otp: req.body.otp }, async (err, datas) => {
                console.log("line 76", datas)
                if (datas) {
                    const superAdminToken = jwt.decode(req.headers.authorization)
                    const decodeId = superAdminToken.userid
                    superadmin.findOne({ _id: decodeId }, async (err, data) => {
                        console.log("line 81", data)
                        if (data) {
                            if (req.body.email == data.email) {
                                console.log("line 78", req.body.email)
                                console.log("line 79", data.email)
                                if (req.body.newPassword == req.body.confirmPassword) {
                                    console.log("line 81", req.body.newPassword)
                                    console.log("line 82",req.body.confirmPassword )

                                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
                                    superadmin.findOneAndUpdate({ _id: decodeId }, { password: req.body.newPassword }, (err, result) => {
                                        if (err) { throw err }
                                        else {
                                            res.status(200).send({ message: "Reset Password Successfully", result })
                                        }
                                    })
                                } else { res.status(400).send({ message: 'password and confirm Password does not match' }) }
                            } else { res.status(400).send({ message: 'email does not match ' }) }
                        }
                    })
                } else { res.status(400).send({ message: 'invalid otp' }) }
            })
        } else {
            const superAdminToken = jwt.decode(req.headers.authorization)
            const decodeId = superAdminToken.userid
            superadmin.findById({ _id: decodeId },async (err, data) => {
                console.log("line 98", data)
                if (data) {
                    console.log('line 100',req.body.email)
                    if (req.body.email == data.email && req.body.contact==data.contact) {
                        const otp = randomString(3)
                        console.log("otp", otp)
                        req.body.superDetails=data
                        sendOtp.create({ superDetails:req.body.superDetails, otp: otp },async (err, datas) => {
                            console.log("line 107", datas)
                            if (err) { throw err }
                            if (datas) {
                                console.log("line 110", datas)
                    
                                postMail( data.email, 'otp for changing password', otp)
                                console.log('line 113', otp)

                                const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                                console.log('line 116',response)
                                res.status(200).send({ message: "verification otp send your email and your mobile number", otp,data,response})
                                setTimeout(() => {
                                        sendOtp.findOneAndDelete({ otp: otp }, (err, result) => {
                                        console.log("line 120", result)
                                        if (err) { throw err }
                                    })
                                }, 200000)
                            }
                        })
                    } else { res.status(400).send({ message: 'email and contact does not match' }) }
                } else { res.status(400).send({ message: 'invalid id' }) }
            })
        } 
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
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
        text: text,
    })
}

exports.adminAcceptOwnerDetails=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
      const data=await register.findOne({_id:req.params.ownerId,deleteFlag:false})
      console.log('line 160',data)
      if(data){
          console.log('line 162',data.email)
          postMail(data.email,"beeTassi","congratulations...!,you are Accepted")
          const datas=await register.findOneAndUpdate({_id:req.params.ownerId},{ownerStatus:'active'},{new:true})
          if(datas){
              console.log('line 166',datas)
              res.status(200).send({message:"you are successfully add for owner",datas})
          }else{
              res.status(400).send({message:"failed",data:[]})
          }
      }else{
          res.status(302).send({message:'invalid id'})
      }
    }else{
        res.status(302).send({message:'invalid super admin token'})
    }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}
exports.adminRejectOwnerDetails=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
      const data=await register.findOne({_id:req.params.ownerId,deleteFlag:false})
      console.log('line 186',data)
      if(data){
          console.log('line 188',data.email)
          postMail(data.email,"beeTassi","oops...!,you are Rejected")
          const datas=await register.findOneAndUpdate({_id:req.params.ownerId},{ownerStatus:'inActive'},{new:true})
          if(datas){
              console.log('line 192',datas)
              res.status(200).send({message:"you are not owner for my site",datas})
          }else{
              res.status(400).send({message:"failed",data:[]})
          }
      }else{
          res.status(302).send({message:'invalid id'})
      }
    }else{
        res.status(302).send({message:'invalid super admin token'})
    }
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}