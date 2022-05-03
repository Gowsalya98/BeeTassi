const router=require('express').Router()

const {addDriver,verifyUserOtp,driverUpdateRideStatus,getAllDriverList,getSingleDriverData,
    updateDriverProfile,deleteDriverProfile}=require('../driverDetails/driver_controller')
const{location}=require('./location_controller')

const multer=require('../middleware/multer')
const valid=require('../register/register_model')

router.post('/addDriver',multer.upload.single('profileImage'),valid.validation,addDriver)

//router.post('/login',valid.validation,login)
router.get('/verifyUserOtp/:otp/:userBookingId',verifyUserOtp)

//driver update ride finish or not
router.get('/driverUpdateRideStatus/:userBookingId',driverUpdateRideStatus)

router.get('/filterLocation/:latitude/:longitude',location)

router.get('/getAllDriverList',getAllDriverList)
router.get('/getSingleDriverData/:id',getSingleDriverData)

router.put('/updateDriverProfile',updateDriverProfile)
router.delete('/deleteDriverProfile/:id',deleteDriverProfile)


module.exports=router