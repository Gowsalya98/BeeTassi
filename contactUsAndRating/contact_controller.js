const {contactUs,rating,aboutUs}=require('./contact_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')
const mongoose=require('mongoose')
const moment=require('moment')
const jwt=require('jsonwebtoken')

const createContactdetails=async(req,res)=>{
    try{
        req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
        const data=await contactUs.create(req.body)
        if(data){
            res.status(200).send({success:'true',message:'successfull',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed',data:[]})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getAllContactUsList=async(req,res)=>{
    try{
        const token=jwt.decode(req.headers.authorization)
        if(token!=null){
            const data=await contactUs.find({})
                if(data){
                    res.status(200).send({success:'true',message:'all list',data:data})
                }else{
                    res.status(400).send({success:'false',message:'failed',data:[]})
                }
        }else{
            res.status(302).send({message:'unauthorized'})
        }
       
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getSingleContactUsDetails=async(req,res)=>{
    try{
        const data=await contactUs.findById({_id:req.params.id})
        if(data){
            res.status(200).send({success:'true',message:'your data',data:data})
        }else{
            res.status(400).send({success:'false',message:'failed',data:[]})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const ratingForCab=async(req,res)=>{
    try{
        const data=await rating.create(req.body)
        if(data!=null){
            const datas=await rating.countDocuments({cabId:data.cabId})
            console.log('line 47',datas);
            const numOfPersons=datas
            const result=await rating.find({cabId:data.cabId},{rating:1,_id:0})
            if(result!=null){
                console.log('line 51',result);
                let rating=0
                for(var i=0;i<result.length;i++){
                    rating+=result[i].rating
                }
                console.log('line 56',rating);
                const average = rating/numOfPersons
                console.log(average)
                const resvalue = Math.ceil(average)
                console.log('line 60',resvalue)
                const grade=await cabDetails.findOneAndUpdate({_id:data.cabId},{$set:{rating:resvalue}},{new:true})
                    if(grade!=null){
                        console.log('line 64',grade);
                        res.status(200).send({message:'successfull',grade})
                    }else{

                    res.status(400).send({message:'failed'}) 

                    }
            }else{
                res.status(400).send({message:'failed to create'}) 
            }
        }else{
            res.status(400).send({message:'failed to create'})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const createAboutUs=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
            if(superAdminToken!=null){
                req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                const data=await aboutUs.create(req.body)
                if(data!=null){
                    res.status(200).send({success:'true',message:'created successfully',data:data})
                }else{
                    res.status(302).send({success:'false',message:'failed to create',data:[]})
                }
            }else{
                res.status(302).send({success:'false',message:'unauthorized'})
            }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const getAllAboutUsDetails=async(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            const data=await aboutUs.aggregate([{$match:{deleteFlag:'false'}}])
                if(data.length!=0){
                    res.status(200).send({success:'true',message:'All list',data:data})
                }else{
                    res.status(400).send({message:'data not found'})
                }
        }else{
            res.status(302).send({success:'false',message:'unauthorized'})
        }
    }catch(err){
        console.log(err)
        res.status(500).send({message:'internal server error'})
    }
}
const getSingleAboutUs=async(req,res)=>{
    try{
        if(req.params.id.length==24){
        const data=await aboutUs.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.id)},{deleteFlag:'false'}]}}])
            if(data.length!=0){
                res.status(200).send({success:'true',message:'your data',data:data})
            }else{
                res.status(302).send({message:'data not found'})
            }
        }else{res.status(302).send({success:'false',message:'invalid id'})}
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const updateAboutUs=async(req,res)=>{
    try{
       if(req.params.id.length==24){
        const data= await aboutUs.findOne({_id:req.params.id,deleteFlag:'false'})
        if(data!=null){
            const datas=await aboutUs.findOneAndUpdate({_id:req.params.id},req.body,{new:true})
            if(datas!=null){
                res.status(200).send({success:'true',message:'data updated successfully',data:datas})
            }else{
                res.status(302).send({success:'false',message:'data not updated',data:[]})
            }
        }else{
            res.status(302).send({success:'false',message:'data not found'})
        }
    }else{
        res.status(302).send({success:'false',message:'invalid id'})
    }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
const deleteAboutUs=async(req,res)=>{
    try{
        if(req.params.id.length==24){
        const data= await aboutUs.findOne({_id:req.params.id,deleteFlag:'false'})
        if(data!=null){
            const datas=await aboutUs.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:'true'}},{returnOriginal:false})
            if(datas!=null){
                res.status(200).send({success:'true',message:'data deleted successfully',data:datas})
            }else{
                res.status(302).send({success:'false',message:'data not deleted',data:[]})
            }
        } else{
            res.status(302).send({success:'false',message:'data not found'})
        }
    }else{
        res.status(302).send({success:'false',message:'invalid id'})
    }
    }catch(err){
        res.status(500).send({message:'internal server error'})
    }
}
module.exports={
    createContactdetails,
    getAllContactUsList,
    getSingleContactUsDetails,
    ratingForCab,
    createAboutUs,
    getAllAboutUsDetails,
    getSingleAboutUs,
    updateAboutUs,deleteAboutUs
}