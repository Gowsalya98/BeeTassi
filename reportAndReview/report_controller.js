
const {report,review}=require('./report_model')
const {register}=require('../register/register_model')
const jwt=require('jsonwebtoken')

const reportForTaxi=(req,res)=>{
    try{
        console.log('line 7',req.body)
        const userToken = jwt.decode(req.headers.authorization)
        const id = userToken.userId
        console.log('line 10',id)
        register.findOne({_id:id,deleteFlag:'false'},(err,datas)=>{
            if(!datas){
                res.status(400).send('invalid token')
            }else{
            req.body.userDetails=datas
                report.create(req.body,(err,data)=>{
                  if(data){
                    console.log('line 18',data)
                    res.status(200).send({message:"successfully Report this cab",data})
                  }
                    else{
                        res.status(400).send('data not found something issued')  
                    }
                })
            }
        })
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getAllReportList=(req,res)=>{
    try{
        report.find({deleteFlag:"false"},(err,data)=>{
            if(data==null){
                res.status(302).send({success:'false',data:[]})
            }else{
            console.log('line 30',data)
            res.status(200).send({success:'true',data:data})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getSingleReportDetails=(req,res)=>{
    try{
        report.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
             if(data==null){
                res.status(302).send({success:'false',data:[]})
            }else{
            console.log('line 55',data)
            res.status(200).send({success:'true',data:data})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const userDeleteOurOwnReportDetails=(req,res)=>{
    try{
        report.findOne({_id:req.params.id,deleteFlag:'false'},(err,datas)=>{
            if(datas){
                report.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{returnOriginal:false},(err,data)=>{
                    if(err)throw err
                    console.log('line 70',data)
                    res.status(200).send({message:'successfully deleted data',data})
                })
            }else{ res.status(400).send('invalid id')}
        })
       
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const reviewForCab=(req,res)=>{
    try{
        const userToken = jwt.decode(req.headers.authorization)
        const id = userToken.userId
        console.log('line 85',id)
        register.findOne({_id:id},(err,datas)=>{
            if(!datas){
                res.status(400).send('invalid token')
            }else{
            req.body.userDetails=datas
                report.create(req.body,(err,data)=>{
                  if(data){
                    console.log('line 18',data)
                    res.status(200).send({message:"your review",data})
                  }
                    else{
                        res.status(400).send('failed')  
                    }
                })
            }
        }) 
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


module.exports={reportForTaxi,getAllReportList,getSingleReportDetails,userDeleteOurOwnReportDetails,
reviewForCab}