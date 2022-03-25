const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()

const errorThrower = require('./errorHandler/error_thrower')
const appError = require('./errorHandler/common_error_handler')
require('./config/db_config')
const app = express()
const superAdmin = require('./superControll/super_route')
const owner=require('./ownerDetails/owner_route')
const user=require('./userDetails/register_route')
const driverDetails  = require('./driverDetails/driver_route')
const vehicleDetails =require('./vehicleDetails/vehicle_route')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/uploads', express.static('/home/fbnode/node_project_gowsi/beeTassi/upload'))

app.use('/BeeTassi/superAdmin', superAdmin)
app.use('/BeeTassi/owner',owner)
app.use('/BeeTassi/user',user)
app.use('/BeeTassi/driverDetails',driverDetails)
app.use('/BeeTassi/vehicleDetails',vehicleDetails)


app.get('/',(req,res)=>{
    res.send('welcome BeeTassi')
})

app.listen(process.env.PORT, () => {
    console.log("port running on ", process.env.PORT)
})

