
const {register}=require('../register/register_model')
const {driverDetails}=require('../driverDetails/driver_model')
const{vehicleDetails}=require('../vehicleDetails/vehicle_model')

const jwt=require('jsonwebtoken')


exports.search = async(req, res) => {
    console.log(req.params.key)
    try {
            const data=await register.find({
                "$or":
                    [{ "companyName": { $regex: req.params.key } },
                    { "location": { $regex: req.params.key } }
                    ]
            })
            console.log('line 18',data);
            res.status(200).send({ message: "search done", data })
                 // {
                //     $search: {
                //       text: {
                //         query: 'search text',
                //         path: ['companyName','location']
                //       }
                //     }
                //   }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}
exports.ownerGetOurOwnEmployeeList=(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
        driverDetails.find({deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            console.log('line 73',data)
            res.status(200).send({message:'your employee list',data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.ownerGetOurOwnVehicleList=(req,res)=>{
    try{
        const ownerToken=jwt.decode(req.headers.authorization)
        const id=ownerToken.userId
        vehicleDetails.find({deleteFlag:"false"},(err,data)=>{
            if(err)throw err
            console.log('line 45',data)
            res.status(200).send({message:'Your Vehicle List',data})
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getAllOwnerList=(req,res)=>{
    try{
        register.find({typeOfRole:'owner'}, (err, data) => {
            console.log("line 88",data)
            if (data[0].deleteFlag == "false") {
                console.log("line 90",data)
                res.status(200).send({ data: data })
            } else {
                console.log('your data is already deleted')
                res.status(400).send({ message: 'your data is already deleted' })
            }

        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.getSingleOwnerDetails=(req,res)=>{
    try{
    const ownerToken = jwt.decode(req.headers.authorization)
    const id = ownerToken.userId
    console.log("line 107",ownerToken.userId)
    console.log("line 108",id)
        register.findOne({_id:id},(err,data)=>{
            console.log("line 109",data)
            if (data.deleteFlag == "false") {
                console.log("line 111",data)
                res.status(200).send({ data: data })
            } else {
                console.log('your data is already deleted')
                res.status(400).send({ message: 'your data is already deleted' })
            }

        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.updateOwnerProfile=(req,res)=>{
    try{
        const ownerToken = jwt.decode(req.headers.authorization)
    const id = ownerToken.userId
    console.log("line 129",ownerToken.userISd)
    console.log("line 130",id)
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 134',data)
                register.findOneAndUpdate({_id:id},req.body,{new:true},(err,result)=>{
                    if(err)throw err
                    console.log('line 137',result)
                    res.status(200).send({message:'profile update successfully',result})
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

exports.deleteOwnerProfile=(req,res)=>{
    try{
        const ownerToken = jwt.decode(req.headers.authorization)
    const id = ownerToken.userId
    console.log("line 151",ownerToken.userId)
    console.log("line 152",id)
        register.findOne({_id:id,deleteFlag:"false"},(err,data)=>{
            if(err){throw err}
            else{
                console.log('line 156',data)
                register.findOneAndUpdate({_id:id},{deleteFlag:'true'},{returnOriginal:false},(err,result)=>{
                    if(err)throw err
                    console.log('line 159',result)
                    res.status(200).send({message:'deleted successfully',result})
                })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}