const router=require('express').Router()

const {createPayment,getAllPaymentList,getSinglePaymentDetails,superAdminPackageDetails,createPaymentId,ownerGetOurOwnPaymentDetails,userGetOurOwnPaymentDetails}=require('./payment_controller')

router.post('/createPayment/:userBookingId',createPayment)

router.get('/createPaymentId',createPaymentId)

router.get('/getAllPaymentList',getAllPaymentList)

router.get('/getSinglePaymentDetails/:id',getSinglePaymentDetails)

router.get('/user-paymentHistory',userGetOurOwnPaymentDetails)

router.get('/owner-paymentHistory',ownerGetOurOwnPaymentDetails)

router.get('/packageDetails/:userBookingId/:paymentId',superAdminPackageDetails)

module.exports=router