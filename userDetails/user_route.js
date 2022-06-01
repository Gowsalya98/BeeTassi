const router=require('express').Router()

const bookingControl=require('./user_controller')

const validationResult=require('../middleware/register_validation')

router.post('/cabBooking',bookingControl.cabBooking)

router.post('/userBookToCab/:cabId',validationResult.validation,bookingControl.userBookingCab)

router.get('/userGetOurOwnBookingHistory',bookingControl.userGetOurOwnBookingHistory)

router.get('/user-previousBookingHistory',bookingControl.userGetOurPreviousBookingHistory)

router.get('/getAllPendingBookingDetails',bookingControl.getAllPendingBookingDetails)

router.get('/getAllUserBookingDetails',bookingControl.getAllUserBookingDetails)

router.get('/getSingleUserBookingDetails/:userBookingId',bookingControl.getSingleUserBookingDetails)

router.put('/userProfile',bookingControl.createUserprofileAccountDetails)

router.get('/getAllUserList',bookingControl.getAllUserList)

router.get('/getSingleUserDetails',bookingControl.getSingleUserDetails)

router.put('/updateUserProfile',bookingControl.updateUserProfile)

router.delete('/deleteUserProfile',bookingControl.deleteUserProfile)

router.get('/search/:key',bookingControl.userSearch)


module.exports=router