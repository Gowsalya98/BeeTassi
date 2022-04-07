const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const { register} = require('./register_model')

exports.register=(req,res)=>{
    try{
        console.log('line 11',req.body)
        register.countDocuments({email:req.body.email},async(err,num)=>{
            if(num==0){
                console.log('line 10',num)
                req.body.password = await bcrypt.hash(req.body.password, 10)
                if(req.file ==null||undefined){
                    req.body.profileImage=""
                }else{
                    req.body.profileImage=`http://192.168.0.112:6600/uploads/${req.file.filename}`
                }
                console.log("line 20",req.body.profileImage)

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
}

exports.login=(req,res)=>{
    try{
        console.log('line 33',req.body)
    register.findOne({email:req.body.email},async(err,data)=>{
        if(data){
            console.log('line 43',data)
                const userId = data._id
               // req.body.userId=userId
                //console.log("line 38",req.body.userId)
                const token = jwt.sign({ userId }, 'secretKey')
                console.log('token:',token)
            req.body.password = await bcrypt.hash(req.body.password, 10)
                console.log('line 42',data)
                res.status(200).send({message:"login successfull",token,data})
        }else{
            res.status(400).send('please signup/invalid email')
        }
       
    })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}