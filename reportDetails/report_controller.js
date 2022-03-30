
const {report}=require('./report_model')
const {register}=require('../register/register_model')

exports.reportForTaxi=(req,res)=>{
    console.log('line 5',req.body)
    try{
        register.findOne({_id:req.params.id,deleteFlag:'false'},(err,datas)=>{
            if(err)throw err
            req.body.userDetails=datas
            console.log('line 7',req.body)
                if(req.file==null||undefined){
                    req.body.taxiImage=""
                }else{
                console.log('line 11',req.file.filename)
                req.body.taxiImage = `http://192.168.0.112:6600/uploads/${req.file.filename}`
                }
                report.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        console.log('line 21',data)
                        res.status(200).send({message:"successfully Report this taxi",data})
                    }
                })
        })
        
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getAllReportList=(req,res)=>{
    try{
        report.find({deleteFlag:"false"},(err,data)=>{
            if(err)throw err
            console.log('line 30',data)
            res.status(200).send({data:data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSingleReportDetails=(req,res)=>{
    try{
        report.findOne({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 42',data)
            res.status(200).send({data:data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.userDeleteOurOwnReportDetails=(req,res)=>{
    try{
        report.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{returnOriginal:false},(err,data)=>{
            if(err)throw err
            console.log('line 60',data)
            res.status(200).send({message:'successfully deleted data',data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}