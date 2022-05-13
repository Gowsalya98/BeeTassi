const {contactUs}=require('./contact_model')

const createContactdetails=async(req,res)=>{
    try{
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
        const data=await contactUs.find({})
        if(data){
            res.status(200).send(data)
        }else{
            res.status(400).send({success:'false',message:'failed',data:[]})
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
module.exports={createContactdetails,getAllContactUsList,getSingleContactUsDetails}