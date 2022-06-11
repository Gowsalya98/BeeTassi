
const {report,review}=require('./report_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')
const {register}=require('../register/register_model')
const moment=require('moment')
const jwt=require('jsonwebtoken')

const createReport=(req,res)=>{
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
                cabDetails.findOne({_id:req.params.cabId,deleteFlag:'false'},(err,result)=>{
                    req.body.cab=result
                    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                    report.create(req.body,(err,data)=>{
                    if(data){
                      console.log('line 18',data)
                      res.status(200).send({message:"successfully Report this cab",data})
                    }else{
                          res.status(400).send('data not found something issued')
                        }
                  })
            })
                
            }
        }) 
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getAllReportList=(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
        report.find({deleteFlag:"false"},(err,data)=>{
            if(data==null){
                res.status(302).send({success:'false',message:'All report list',data:[]})
            }else{
            console.log('line 30',data)
            res.status(200).send({success:'true',message:'data not found',data:data})
            }
        })
    }else{
        res.status(400).send({message:'unauthorized'})   
    }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const getSingleReportDetails=(req,res)=>{
    try{
        report.findOne({_id:req.params.reportId,deleteFlag:'false'},(err,data)=>{
             if(data==null){
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }else{
            console.log('line 55',data)
            res.status(200).send({success:'true',message:'your data',data:data})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const userDeleteOurOwnReportDetails=(req,res)=>{
    try{
        report.findOne({_id:req.params.reportId,deleteFlag:'false'},(err,datas)=>{
            if(datas){
                report.findOneAndUpdate({_id:req.params.reportId},{$set:{deleteFlag:"true"}},{returnOriginal:false},(err,data)=>{
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

const createReview=(req,res)=>{
    try{
        const userToken = jwt.decode(req.headers.authorization)
        const id = userToken.userId
        register.findOne({_id:id,deleteFlag:'false'},(err,datas)=>{
            if(!datas){
                res.status(400).send('invalid token')
            }else{
                req.body.userDetails=datas
                cabDetails.findOne({_id:req.params.cabId,deleteFlag:'false'},async(err,result)=>{
                    req.body.cab=result
                    req.body.createdAt=moment(new Date()).toISOString().slice(0,10)
                    // var reviews={}
                    // reviews.description=req.body.description
                    // req.body.review=reviews
                    const result1=await cabDetails.findOneAndUpdate({_id:req.params.cabId},{$set:{review:req.body.description}},{new:true})
                    if(result1){
                    review.create(req.body,(err,data)=>{
                    if(data){
                      res.status(200).send({message:"review post successfully",data})
                    }else{
                          res.status(400).send('data not found something issued')
                        }
                  })
                }else{
                    res.status(400).send('data does not update') 
                }
            })
                
            }
        }) 
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const getAllReview=(req,res)=>{
    try{
        const superAdminToken=jwt.decode(req.headers.authorization)
        if(superAdminToken!=null){
            review.find({deleteFlag:"false"},(err,data)=>{
                if(data!=null){
                    res.status(200).send({success:'true',message:'All review list',data})
                }else{
                    res.status(302).send({success:'false',message:'data not found',data:[]})
                }
            })
        }else{
            res.status(400).send({message:'unauthorized'})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}
const getSingleReview=(req,res)=>{
    try{
        review.findOne({_id:req.params.reviewId,deleteFlag:'false'},(err,data)=>{
             if(data==null){
                res.status(302).send({success:'false',message:'data not found',data:[]})
            }else{
            res.status(200).send({success:'true',message:'your data',data:data})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const userDeleteOurOwnReview=(req,res)=>{
    try{
        review.findOne({_id:req.params.reviewId,deleteFlag:'false'},(err,datas)=>{
            if(datas){
                review.findOneAndUpdate({_id:req.params.reviewId},{$set:{deleteFlag:"true"}},{returnOriginal:false},(err,data)=>{
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


module.exports={
    createReport,
    getAllReportList,
    getSingleReportDetails,
    userDeleteOurOwnReportDetails,
    createReview,
    getAllReview,
    getSingleReview,
    userDeleteOurOwnReview
}