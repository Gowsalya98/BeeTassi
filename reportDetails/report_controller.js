
const {report}=require('./report_model')
const {register}=require('../register/register_model')
const jwt=require('jsonwebtoken')

exports.reportForTaxi=(req,res)=>{
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
                    res.status(200).send({message:"successfully Report this vehicle",data})
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

exports.getAllReportList=(req,res)=>{
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

exports.getSingleReportDetails=(req,res)=>{
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

exports.userDeleteOurOwnReportDetails=(req,res)=>{
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