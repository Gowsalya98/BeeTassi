const router=require('express').Router()
const bookingControl=require('./user_controller')
const validationResult=require('../middleware/register_validation')

//user booking
router.post('/userBookToCab/:carRegNumber',validationResult.valid,bookingControl.userBookingCab)
router.get('/userGetOurOwnBookingHistory',bookingControl.userGetOurOwnBookingHistory)
router.get('/user-previousBookingHistory',bookingControl.userGetOurPreviousBookingHistory)
router.get('/getAllPendingBookingDetails',bookingControl.getAllPendingBookingDetails)
router.get('/getAllUserBookingDetails',bookingControl.getAllUserBookingDetails)
router.get('/getSingleUserBookingDetails/:userBookingId',bookingControl.getSingleUserBookingDetails)

//cancel booking
router.post('/cancel-booking/:bookingId',bookingControl.userCancelForCab)
router.get('/getAll-cancelBooking',bookingControl.getAllCancelBooking)
router.get('/ownCancelBooking',bookingControl.userGetOurcancelBookingHistory)

//user details
router.put('/userProfile',bookingControl.createUserprofileAccountDetails)
router.get('/getAllUserList',bookingControl.getAllUserList)
router.get('/getSingleUserDetails',bookingControl.getSingleUserDetails)
router.put('/updateUserProfile',bookingControl.updateUserProfile)
router.delete('/deleteUserProfile',bookingControl.deleteUserProfile)

//super Admin ride count list
router.get('/today-ride',bookingControl.TodayRide)
router.get('/total-ride',bookingControl.TotalRide)

//search API
router.get('/search/:key',bookingControl.userSearch)


module.exports=router