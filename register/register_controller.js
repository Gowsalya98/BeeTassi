const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const fast2sms=require('fast-two-sms')
const { register,image,sendOtp} = require('./register_model')
const {driverDetails}=require('../driverDetails/driver_model')
const {randomString}=require('../userDetails/random_string')

const registerForAll=(req,res)=>{
    try{
        console.log('line 11',req.body)
        register.countDocuments({email:req.body.email},async(err,num)=>{
            if(num==0){
                console.log('line 10',num)
                req.body.password = await bcrypt.hashSync(req.body.password, 10)
                register.create(req.body,async(err,data)=>{
                    if(data){
                        const otp = randomString(3)
                        console.log("otp", otp)
                        req.body.userDetails=data
                        const datas=await sendOtp.create({otp: otp,userDetails:req.body.userDetails})
                        if (datas) {
                        postMail(data.email,"verification otp",otp)
                        const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                        res.status(200).send({ message: "verification otp send your mobile number,Register Successfull",data:datas})
                        setTimeout(() => {
                            sendOtp.findOneAndDelete({ otp: otp }, (err, result) => {
                                if (err) { throw err }
                                console.log("line 24", result)
                            })
                        }, 50000000)
                        }else{
                            res.status(400).send({success:'false',message:'failed'})
                        }
                    }else{
                        res.status(400).send({success:'false',message:'failed'})
                    }
                })
            }else{
                res.status(400).send({success:'false',message:'email already exist'})
            }
    })
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const verificationOtp=async(req,res)=>{
    try{
       const data=await sendOtp.aggregate([{$match:{otp:req.body.otp}}])
       console.log('line 52',data)
       if(data.length!=0){
           res.status(200).send({success:'true',message:'successfull',data})
       }else{
           res.status(400).send({success:'false',message:'invalid otp try it again',data:[]})
       }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const registerImage=(req,res)=>{
    try{
        if(req.file ==null||undefined){
            req.body.image=""
        }else{
            req.body.image=`http://192.168.0.112:6600/uploads/${req.file.filename}`
        }
        console.log("line 32",req.body.image)
        image.create(req.body,(err,data)=>{
            if(err)throw err
            res.status(200).send({message:'image upload successfully',data})
        })
    }catch(err){
        res.status(500).send({success:'false',message:'internal server error'})  
    }
}
const login=(req,res)=>{
    try {
        console.log('line 47',req.body)
        register.findOne({ email: req.body.email,deleteFlag:'false'},async (err, data) => {
                console.log("line 50",data)
                if(data!=null){
                    if (data.typeOfRole==='user'||data.typeOfRole==='owner') {
                        const verifyPassword = await bcrypt.compare(req.body.password,data.password)
                        if (verifyPassword === true) {
                            const token = await jwt.sign({ userId: data._id }, process.env.SECRET_KEY)
                            res.status(200).send({ message: 'login successfull',token,data })
                        } else {res.status(400).send({ message: 'password does not match' })}
                    }else{res.status(400).send({message:"something wrong"})}
                }else if(data==null){
                    driverDetails.findOne({ email: req.body.email,deleteFlag:"false"},async (err, data) => {
                        console.log("line 60",data)
                        if(data!=null){
                        if (data.typeOfRole=='driver'){
                            const password=await bcrypt.compare(req.body.password,data.password)
                            console.log('line 64',password);
                          //  if (password == true) {
                                const token = await jwt.sign({ userId: data._id }, process.env.SECRET_KEY)
                                var Location={}
                                Location.driverLatitude=req.body.driverLocation.driverLatitude
                                Location.driverLongitude=req.body.driverLocation.driverLongitude
                                    req.body.driverLocation=Location
                                    driverDetails.findOneAndUpdate({email:req.body.email,deleteFlag:"false"},req.body,{new:true},(err,datas)=>{
                                        console.log('line 72',datas);
                                            res.status(200).send({ message: 'login successfull',token,datas })
                            
                        })
                    //}else{res.send({message:'password does not match'})}
                }else{res.send({message:'unauthorized'})}
            }else{res.send({message:'data not found'})}
                })
                
                }else{
                    res.send({message:'invalid'})
                }
        })
    } catch (error) {
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const forgetPassword=(req,res)=>{
    try{
        if (req.body.otp != null) {
            sendOtp.findOne({ otp: req.body.otp }, async (err, result) => {
                console.log("line 72", result)
                if (result) {
                    const token = jwt.decode(req.headers.authorization)
                    const id = token.userId
                    register.findOne({ _id:id,deleteFlag:'false' }, async (err, data) => {
                        console.log("line 77", data)
                        if (data) {
                            if (req.body.email == data.email||req.body.contact==data.contact) {
                                console.log("line 77", req.body.email)
                                console.log("line 78", data.email)

                                if (req.body.newPassword == req.body.confirmPassword) {
                                    console.log("line 81", req.body.newPassword)
                                    console.log("line 82", req.body.confirmPassword)

                                    req.body.newPassword = await bcrypt.hash(req.body.newPassword, 10)
                                    register.findOneAndUpdate({ _id:id }, { $set:{password: req.body.newPassword} },{new:true}, (err, datas) => {
                                        if (err) { throw err }
                                        else {
                                            console.log('line 92',datas);
                                            res.status(200).send({ message: "Reset Password Successfully", datas })
                                        }
                                    })
                                } else { res.status(400).send({ message: 'password does not match' }) }
                            } else { res.status(400).send({ message: 'email does not match ' }) }
                        }
                    })
                } else { res.status(400).send({ message: 'invalid otp' }) }
            })
        } else {
            const token = jwt.decode(req.headers.authorization)
            const id = token.userId
            register.findOne({ _id:id,deleteFlag:'false'},(err,data) => {
                console.log("line 103", data)
                if (data) {
                    console.log('line 123',data.email);
                    console.log('line 124',data.contact);
                    if (req.body.email == data.email && req.body.contact == data.contact) {
                        console.log('hai')
                        const otp = randomString(3)
                        console.log("otp", otp)
                        req.body.userDetails=data
                       sendOtp.create({ otp: otp,userDetails:req.body.userDetails},async(err, result) => {
                            console.log("line110", result)
                            if (err) { throw err }
                            if (result) {
                                console.log("line 113", result)
                                postMail(req.body.email, 'otp for changing password', otp)
                                console.log('line 115', otp)

                                const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[data.contact]})

                                res.status(200).send({ message: "verification otp send your email and your mobile number",result})
                                setTimeout(() => {
                                    sendOtp.findOneAndDelete({ otp: otp }, (err, datas) => {
                                        console.log("line 124", datas)
                                        if (err) { throw err }
                                    })
                                }, 2000000)
                            }
                        })
                    } else { res.status(400).send({ message: 'email and contact does not match' }) }
                } else { res.status(400).send({ message: 'invalid token' }) }
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
const postMail = function (to, subject, text) {
    return transport.sendMail({
        from: 'nishagowsalya339@gmail.com',
        to: to,
        subject: subject,
        text: text,
    })
}


const aggregateLogin=async(req,res)=>{
    console.log('line 171',req.body)
    const data=await register.aggregate([{$match:{$and:[{email:req.body.email},{deleteFlag:"false"}]}}])
    if(data){
        console.log('line 174',data)
        const password=await bcrypt.compare(req.body.password,data[0].password)
        console.log('line 176',data)
        if(password==true){
            res.status(200).send({message:'login successfull',data})
        }else{
        res.status(400).send({message:'invalid password'})
        }
    }else{
        res.status(400).send({message:'data not exists'})
    }
}

module.exports={
    registerForAll,registerImage,login,verificationOtp,forgetPassword,aggregateLogin
}