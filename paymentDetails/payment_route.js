const router=require('express').Router()

const paymentControl=require('./payment_controller')

router.post('/createPayment/:userBookingId',paymentControl.createPayment)

router.get('/createPaymentId',paymentControl.createPaymentId)

router.get('/getAllPaymentList',paymentControl.getAllPaymentList)

router.get('/getSinglePaymentDetails/:id',paymentControl.getSinglePaymentDetails)

router.get('/user-paymentHistory',paymentControl.userGetOurOwnPaymentDetails)

router.get('/owner-paymentHistory',paymentControl.ownerGetOurOwnPaymentDetails)

router.get('/packageDetails/:userBookingId/:paymentId',paymentControl.superAdminPackageDetails)

router.get('/total-Earning',paymentControl.TotalEarning)

router.get('/today-Earning',paymentControl.TodayEarning)

module.exports=router