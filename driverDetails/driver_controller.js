const {driverDetails}=require('./driver_model')

const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

exports.registerForDeliveryCandidate=((req,res)=>{
    //console.log('hai')
    console.log('line 7',req.body)
    try{
        console.log('line 9',req.body)
        const ownerToken=jwt.decode(req.headers.authorization)
        const id = ownerToken.userid
        req.body.driverId=id
        driverDetails.countDocuments({email:req.body.email }, async (err, num) => {
            console.log('line 14',num)
            if (num == 0) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
                if(req.file==null||undefined){
                    req.body.profileImage=""
                }else{
                console.log('line 20',req.file.filename)
                req.body.profileImage = `http://192.168.0.112:6600/uploads/${req.file.filename}`
                }
                driverDetails.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 26',data)
                        res.status(200).send({message:"Register successfully",data})
                    }
                })
            }else{
                res.status(400).send({message:'Data already exists'})
            }
            })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.login=((req,res)=>{
    try{
        console.log("line 41",req.body)
        driverDetails.findOne({email:req.body.email},async(err,data)=>{
            console.log('line 43',data)
            if(data){
                if(data.role=="driver"){
                    console.log("line 45",data.role)
                    const userid=data._id
                    const token = jwt.sign({ userid }, 'secretKey')
                console.log('token:',token)
            req.body.password = await bcrypt.hash(req.body.password, 10)
            driverDetails.findOneAndUpdate({email:data.email},req.body,{new:true},(err,datas)=>{
                if(err)throw err
                console.log('line 54',datas)
                res.status(200).send({message:"login successfull",token,datas})
            })
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

exports.ownerGetOurOwnEmployeeList=((req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userid
        driverDetails.find({driverId:id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 73',data)
            res.status(200).send(data)
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.getAllDriverList=((req,res)=>{
    try{
        driverDetails.find({deleteFlag:"false"},(err,data)=>{
            if(err)throw err
            console.log('line 71',data)
            res.status(200).send(data)
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.getSingleDriverData=((req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        const id=driverToken.userid
        driverDetails.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err)throw err
            console.log('line 99',data)
            res.status(200).send(data)
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.updateDriverProfile=((req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        const id=driverToken.userid
        driverDetails.findOne({_id:id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            driverDetails.findOneAndUpdate({_id:id},req.body,{new:true},(err,datas)=>{
                if(err)throw err
                console.log('line 115',datas)
                res.status(200).send({message:'update successfully',datas})
            })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.deleteDriverProfile=((req,res)=>{
    try{
        const driverToken=jwt.decode(req.headers.authorization)
        const id=driverToken.userid
        driverDetails.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err)throw err
            driverDetails.findOneAndUpdate({_id:id},{$set:{deleteFlag:'true'}},{returnOriginal:false},(err,datas)=>{
                if(err)throw err
                console.log('line 130',datas)
                res.status(200).send({message:"sucessfully deleted your data",datas})
            })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})