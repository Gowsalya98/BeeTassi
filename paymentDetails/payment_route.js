const router=require('express').Router()

const {createPayment,getAllPaymentList,getSinglePaymentDetails,superAdminPackageDetails,createPaymentId}=require('./payment_controller')

router.post('/createPayment/:userBookingId',createPayment)
router.get('/createPaymentId',createPaymentId)

router.get('/getAllPaymentList',getAllPaymentList)
router.get('/getSinglePaymentDetails/:id',getSinglePaymentDetails)

router.get('/packageDetails/:userBookingId/:paymentId',superAdminPackageDetails)

module.exports=router