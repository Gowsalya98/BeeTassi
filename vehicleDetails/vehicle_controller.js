
const {cabDetails,cabImage}=require('./vehicle_model')
const {register}=require('../register/register_model')
const jwt=require('jsonwebtoken')

exports.addCabDetails=((req,res)=>{
    try{
        console.log('line 8',req.body)
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
       console.log('line 12',id)
        req.body.cabId=id
                register.findOne({_id:id,deleteFlag:'false'},(err,result)=>{
                    if(result){
                    req.body.cabOwner=result
                cabDetails.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 28',data)
                        res.status(200).send({message:"add cab successfully",data})
                    }
                })
            }else{res.status(400).send({message:'invalid Token'})}
                })
                
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.cabDetailImage=(req,res)=>{
    try{
        if(req.file==undefined||null){
            req.body.image=""
        }else{
        req.body.image = `http://192.168.0.112:6600/uploads/${req.file.filename}`
        }
        cabImage.create(req.body,(err,data)=>{
            if(data){
            console.log('line 45',data)
            res.status(200).send({message:'Upload Image Successfull',data})
            }else{res.status(400).send({message:'please upload chooseable format pdf/jpg/jpeg/png/txt'})}
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getAllCabList=(req,res)=>{
    try{
        cabDetails.find({deleteFlag:"false"},(err,data)=>{
            if(err){
                res.status(400).send({message:'failed',data:[]})
            }else{
                data.sort().reverse()
                console.log('line 57',data)
            res.status(200).send({message:'your data',data})
            }
            
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
exports.getAllAvailableCabList=(req,res)=>{
    try{
        cabDetails.find({cabStatus:'available',deleteFlag:'false'},(err,data)=>{
            if(err){
                res.status(400).send({message:'failed',data:[]})
            }else{
                data.sort().reverse()
                console.log('line 72',data);
                res.status(200).send({message:'available cab list',data})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSingleCabDetails=(req,res)=>{
    try{
        if(req.headers.authorization){
            console.log('line 67',req.params.id)
        cabDetails.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(data){
            console.log('line 70',data)
            res.status(200).send(data)
            }else{
                res.status(400).send({message:'invalid id',data:[]})
            }
        })
        }else{
            res.status(400).send({message:'invalid token'})
        }
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.updateCabDetails=(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
        cabDetails.findOne({cabId:id,deleteFlag:'false'},(err,datas)=>{
            if(err)throw err
            console.log('line 87',datas)
            cabDetails.findOneAndUpdate({cabId:id},req.body,{new:true},(err,data)=>{
                if(err)throw err
                console.log('line 90',data)
                res.status(200).send({message:'sucessfully update cab details',data})
            })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.deleteCabDetails=(req,res)=>{
    try{
        if(req.headers.authorization){
            cabDetails.findOne({_id:req.params.id,deleteFlag:'false'},(err,datas)=>{
                if(datas){
                    cabDetails.findOneAndUpdate({_id:req.params.id},{deleteFlag:'true'},{returnOriginal:false},(err,data)=>{
                        if(err)throw err
                        console.log('line 92',data)
                        res.status(200).send({message:'sucessfully delete your data',data})
                    })
                }else{
                    res.status(400).send({message:'invalid id'})
                }
            })
        }else{
            res.status(400).send({message:'invalid token'})
        }
       
    }catch(err){
        res.status(500).send({message:err.message})
    }
}