
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
                // if(req.file==null||undefined){
                //     req.body.vehicleImage=""
                // }else{
                // console.log('line 14',req.file.filename)
                // req.body.vehicleImage = `http://192.168.0.112:6600/uploads/${req.file.filename}`
                // }
                register.findOne({_id:id,deleteFlag:'false'},(err,result)=>{
                    if(err)throw err
                    console.log('line 21',result._id)
                    console.log('line 23',result)
                    req.body.vehicleOwner=result
                    //req.body.vehicleDetails=JSON.parse(req.body.vehicleDetails)
                vehicleDetails.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 28',data)
                        res.status(200).send({message:"add vehicle successfully",data})
                    }
                })
                })
                
    }catch(err){
        res.status(500).send({message:err.message})
    }
})

exports.vehicleDetailsImage=(req,res)=>{
    try{
        req.body.image = `http://192.168.0.112:6600/uploads/${req.file.filename}`
        vehicleDetailsImage.create(req.body,(err,data)=>{
            if(err)throw err
            console.log('line 45',data)
            res.status(200).send({message:'Upload Image Successfull',data})
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
            vehicleDetails.findOneAndUpdate({vehicleId:id},req.body,{new:true},(err,data)=>{
                if(err)throw err
                console.log('line 77',data)
                res.status(200).send({message:'sucessfully update vehicle details',data})
            })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.deleteVehicleDetails=(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
        vehicleDetails.findOne({_id:req.params.id,deleteFlag:'false'},(err,datas)=>{
            if(err)throw err
            vehicleDetails.findOneAndUpdate({_id:req.params.id},{deleteFlag:'true'},{returnOriginal:false},(err,data)=>{
                if(err)throw err
                console.log('line 92',data)
                res.status(200).send({message:'sucessfully delete your data',data})
            })
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}