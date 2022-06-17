const geolib = require("geolib");
const jwt=require('jsonwebtoken')
const {driverDetails}=require('./driver_model')
const {cabDetails}=require('../vehicleDetails/vehicle_model')

exports.location=(req,res)=>{
    driverDetails.find({deleteFlag:'false'},(err,data)=>{
      if(err)throw err
      console.log('line 9',data)
      const datas=data.filter(((result) => filterLocation(result, 50000,req.params.latitude,req.params.longitude)))
     res.status(200).send({message:"nearby cab details",datas})
    })
    
}
function filterLocation(result, radius=50000, latitude,longitude)
    {
      if (!result.driverLocation) {
        return false;
      }
      console.log('line 21',result.driverLocation.driverLatitude);
      console.log('line 22',result.driverLocation.driverLongitude);
      var x = geolib.isPointWithinRadius(
        {
          latitude: result.driverLocation.driverLatitude,
          longitude: result.driverLocation.driverLongitude,
        },
        { 
          latitude,longitude
        },
           radius
      );
      console.log('x',x)
      if (x === true) {
        console.log('line 35',result)
        return result;
      }
       
}

exports.selectCabForUser=async(req,res)=>{
  try{
    const userToken=jwt.decode(req.headers.authorization)
    if(userToken!=null){
    const data=await driverDetails.aggregate([{$match:{$and:[{carRegNumber:req.body.carRegNumber},{deleteFlag:'false'}]}}])
    console.log('line 45',data);
    if(data!=null){
      console.log('line 46',data);
      res.status(200).send({success:'true',message:'your selected cab',data})
    }else{
      res.status(302).send({message:'data not found'})
    }
  }else{
    res.status(302).send({message:'unauthorized'})
  }
  }catch(err){
    res.status(500).send({message:'internal server error'})
  }
}