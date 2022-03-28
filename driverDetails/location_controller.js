const geolib = require("geolib");
const {register}=require('../userDetails/register_model')
const {driverDetails}=require('./driver_model')


exports.location=(req,res)=>{
    driverDetails.find({deleteFlag:'false'},(err,data)=>{
      if(err)throw err
      console.log('line 9',data)
      data.filter(((result) => filterLocation(result, 50000, result.driverLocation.driverLatitude, result.driverLocation.driverLongitude)))
    })
    
}

function filterLocation(result, radius=50000, driverLatitude,driverLongitude)
    {
      if (!result.driverLocation) {
        return false;
      }
      console.log('line 21',result.driverLocation.driverLatitude);
      console.log('line 22',result.driverLocation.driverLongitude);
      var x = geolib.isPointWithinRadius(
        {
          driverLatitude: result.driverLocation.driverLatitude,
          driverLongitude: result.driverLocation.driverLongitude,
        },
        { 
          userLatitude:result.pickUpLocation.pickUpLatitude, 
          userLongitude:result.pickUpLocation.pickUpLongitude,
        },
           radius
      );
      if (x === true) {
        return result;
      }
}