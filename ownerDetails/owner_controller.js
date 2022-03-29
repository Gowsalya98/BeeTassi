const {register}=require('../userDetails/register_model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

exports.registerForOwnerDetails=((req,res)=>{
    //console.log('hai')
    console.log('line 7',req.body)
    try{
        console.log('line 9',req.body)
        register.countDocuments({email:req.body.email }, async (err, num) => {
            console.log('line 11',num)
            if (num == 0) {
                req.body.password = await bcrypt.hash(req.body.password, 10)
                if(req.body.profileImage ==null||undefined){
                    req.body.profileImage=""
                }else{
                    req.body.profileImage=`http://192.168.0.112:6600/uploads/${req.body.profileImage}`
                }
                console.log("line 20",req.body.profileImage)
               
                register.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 27',data)
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
        console.log('line 36',req.body)
    register.findOne({email:req.body.email},async(err,data)=>{
        if(data){
            if(data.role=='owner'){
                console.log("line 40",data._id)
                req.body.ownerId=data._id
                console.log("line 42",req.body.ownerId)
                const userid = data._id
                const token = jwt.sign({ userid }, 'secretKey')
                console.log('token:',token)
            req.body.password = await bcrypt.hash(req.body.password, 10)
                console.log('line 43',data)
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

exports.search = (async (req, res) => {
    console.log(req.params.key)
    try {
            const data=await register.find(
                {
                    $search: {
                      text: {
                        query: 'search text',
                        path: ['companyName','presidentName']
                      }
                    }
                  }
             )
            res.status(200).send({ message: "search done", data })
        
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
})

exports.getAllOwnerList=((req,res)=>{
    try{
        register.find({}, (err, data) => {
            console.log("line 88",data)
            if (data[0].deleteFlag == "false") {
                console.log("line 90",data)
                res.status(200).send({ message: data })
            } else {
                console.log('your data is already deleted')
                res.status(400).send({ message: 'your data is already deleted' })
            }

        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.getSingleOwnerDetails=((req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
    const id = token.userid
    console.log("line 107",token.userid)
    console.log("line 108",id)
        register.findOne({_id:id},(err,data)=>{
            console.log("line 109",data)
            if (data.deleteFlag == "false") {
                console.log("line 111",data)
                res.status(200).send({ message: data })
            } else {
                console.log('your data is already deleted')
                res.status(400).send({ message: 'your data is already deleted' })
            }

        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.updateOwnerProfile=((req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
    const id = token.userid
    console.log("line 129",token.userid)
    console.log("line 130",id)
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 134',data)
                register.findOneAndUpdate({_id:id},req.body,{new:true},(err,result)=>{
                    if(err)throw err
                    console.log('line 137',result)
                    res.status(200).send({message:'profile update successfully',result})
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.deleteOwnerProfile=((req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
    const id = token.userid
    console.log("line 151",token.userid)
    console.log("line 152",id)
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 156',data)
                register.findOneAndUpdate({_id:id},{$set:{deleteFlag:true}},{returnOriginal:false},(err,result)=>{
                    if(err)throw err
                    console.log('line 159',result)
                    res.status(200).send({message:'deleted successfully',result})
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
})