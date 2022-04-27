
const {vehicleDetails,vehicleDetailsImage}=require('./vehicle_model')
const {register}=require('../register/register_model')
const jwt=require('jsonwebtoken')

exports.addVehicleDetails=((req,res)=>{
    try{
        console.log('line 8',req.body)
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
       console.log('line 12',id)
        req.body.vehicleId=id
                register.findOne({_id:id,deleteFlag:'false'},(err,result)=>{
                    if(result){
                    req.body.vehicleOwner=result
                vehicleDetails.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 28',data)
                        res.status(200).send({message:"add vehicle successfully",data})
                    }
                })
            }else{res.status(400).send({message:'invalid Token'})}
                })
                
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.vehicleDetailsImage=(req,res)=>{
    try{
        if(req.file==undefined||null){
            req.body.image=""
        }else{
        req.body.image = `http://192.168.0.112:6600/uploads/${req.file.filename}`
        }
        vehicleDetailsImage.create(req.body,(err,data)=>{
            if(data){
            console.log('line 45',data)
            res.status(200).send({message:'Upload Image Successfull',data})
            }else{res.status(400).send({message:'please upload chooseable format pdf/jpg/jpeg/png/txt'})}
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getAllVehicleList=(req,res)=>{
    try{
        vehicleDetails.find({deleteFlag:"false"},(err,data)=>{
            if(err)throw err
            console.log('line 57',data)
            res.status(200).send(data)
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSingleVehicleDetails=(req,res)=>{
    try{
        console.log('line 67',req.params.id)
        vehicleDetails.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 70',data)
            res.status(200).send(data)
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.updateVehicleDetails=(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
        vehicleDetails.findOne({vehicleId:id,deleteFlag:'false'},(err,datas)=>{
            if(err)throw err
            console.log('line 87',datas)
            vehicleDetails.findOneAndUpdate({vehicleId:id},req.body,{new:true},(err,data)=>{
                if(err)throw err
                console.log('line 90',data)
                res.status(200).send({message:'sucessfully update vehicle details',data})
            })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.deleteVehicleDetails=(req,res)=>{
    try{
        if(req.headers.authorization){
            vehicleDetails.findOne({_id:req.params.id,deleteFlag:'false'},(err,datas)=>{
                if(datas){
                    vehicleDetails.findOneAndUpdate({_id:req.params.id},{deleteFlag:'true'},{returnOriginal:false},(err,data)=>{
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