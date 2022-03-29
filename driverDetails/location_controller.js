const geolib = require("geolib");
const {register}=require('../userDetails/register_model')
const {driverDetails}=require('./driver_model')


exports.location=(req,res)=>{
    driverDetails.find({deleteFlag:'false'},(err,data)=>{
      if(err)throw err
      console.log('line 9',data)
      //var userLocation =;
      data.filter(((result) => filterLocation(result, 50000,req.params.latitude,req.params.longitude)))
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
      if (x === true) {
        return result;
      }
}