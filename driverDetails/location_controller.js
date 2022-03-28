const geolib = require("geolib");

module.exports = {
  filterWithiRadius:function(radiusObj, radius=50000, pickUpLatitude, pickUpLongitude) {
    if (!radiusObj.driverLocation) {
      return false;
    }
    console.log(radiusObj.driverLocation.driverLatitude);
    var x = geolib.isPointWithinRadius(
      {
        latitude: radiusObj.driverLocation.driverLatitude,
        longitude: radiusObj.driverLocation.driverLongitude,
      },
      { latitude, longitude },
      radius
    );
    if (x === true) {
      return radiusObj;
    }
  }
}