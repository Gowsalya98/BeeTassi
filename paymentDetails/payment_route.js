const router=require('express').Router()
const paymentControl=require('./payment_controller')

//payment details
router.get('/createPaymentId',paymentControl.createPaymentId)
router.post('/createPayment/:userBookingId',paymentControl.createPayment)
router.get('/getAllPaymentList',paymentControl.getAllPaymentList)
router.get('/getSinglePaymentDetails/:id',paymentControl.getSinglePaymentDetails)

//user and owner and driver get own payment details
router.get('/user-paymentHistory',paymentControl.userGetOurOwnPaymentDetails)
router.get('/owner-paymentHistory',paymentControl.ownerGetOurOwnPaymentDetails)
router.get('/driver-TotalPayout',paymentControl.driverGetOwnTotalPayouts)
router.get('/driver-TodayPayout',paymentControl.driverGetOwnTodayPayouts)

//package for super admin
router.get('/packageDetails/:userBookingId/:paymentId',paymentControl.superAdminPackageDetails)

//count for owner and super admin
router.get('/owner-totalPayout',paymentControl.ownerGetOwnPaymentCount)
router.get('/total-Earning',paymentControl.TotalEarning)
router.get('/today-Earning',paymentControl.TodayEarning)

module.exports=router