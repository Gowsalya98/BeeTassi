const {contactUs,rating}=require('./contact_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')

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


module.exports={
    createContactdetails,
    getAllContactUsList,
    getSingleContactUsDetails,
    ratingForCab
}