const router=require('express').Router()
const driverControl=require('../driverDetails/driver_controller')  
const{location}=require('./location_controller')
const valid=require('../register/register_model')

router.post('/addDriver',valid.validation,driverControl.addDriver)
router.get('/getAllDriverList',driverControl.getAllDriverList)
router.get('/getSingleDriverData/:id',driverControl.getSingleDriverData)
router.put('/updateDriverProfile',driverControl.updateDriverProfile)
router.delete('/deleteDriverProfile/:id',driverControl.deleteDriverProfile)

//owner get our own vehicle count list
router.get('/owner-driverCount',driverControl.ownerGetOwnDriverCount)

//superAdmin driver count list
router.get('/total-driver',driverControl.TotalDriver)
router.get('/today-driver',driverControl.TodayDriver)

//router.post('/login',valid.validation,login)
router.post('/verifyUserOtp',driverControl.verifyUserOtp)

//driver update ride finish or not
router.get('/driverUpdateRideStatus/:userBookingId',driverControl.driverUpdateRideStatus)

//driver accept and reject user ride
router.get('/acceptUserRide/:bookingId',driverControl.driverAcceptUserRide)
router.get('/rejectUserRide/:bookingId',driverControl.driverRejectUserRide)

//filter location
router.get('/filterLocation/:latitude/:longitude',location)


module.exports=router