const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const errorThrower = require('./errorHandler/error_thrower')
const appError = require('./errorHandler/common_error_handler')
require('./config/db_config')
const app = express()

const register=require('./register/register_route')
const user=require('./userDetails/user_route')
const owner=require('./ownerDetails/owner_route')
const driverDetails  = require('./driverDetails/driver_route')
const vehicleDetails =require('./vehicleDetails/vehicle_route')
const payment=require('./paymentDetails/payment_route')
const report=require('./reportDetails/report_route')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/uploads', express.static('/home/fbnode/NODE_GOWSI/uploads/BeeTassi/'))

app.use('/BeeTassi',register)
app.use('/BeeTassi/user',user)
app.use('/BeeTassi/owner',owner)
app.use('/BeeTassi/driverDetails',driverDetails)
app.use('/BeeTassi/vehicleDetails',vehicleDetails)
app.use('/BeeTassi/payment',payment)
app.use('/BeeTassi/report',report)


app.get('/',(req,res)=>{
    res.send('welcome BeeTassi')
})

calcCrow(9.91051,78.1158,9.4541596,77.557643).toFixed(1);
   
    function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R =  6371;
      var dLat = toRad(lat2-lat1);
      console.log('line 45',dLat) 
      var dLon = toRad(lon2-lon1);
      console.log('line 47',dLon) 
      var lat1 = toRad(lat1);
      console.log('line 49',lat1) 
      var lat2 = toRad(lat2);
      console.log('line 51',lat2) 

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        console.log('line 51',a) 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      console.log('line 52',c)
      var d = R * c;
      console.log('line 54',d)
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }

app.listen(process.env.PORT, () => {
    console.log("port running on ", process.env.PORT)
})

