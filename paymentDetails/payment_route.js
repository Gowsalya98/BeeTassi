const router=require('express').Router()

const {createPayment,getAllPaymentList,getSinglePaymentDetails,superAdminPackageDetails,createOrderId}=require('./payment_controller')

router.post('/createPayment/:id',createPayment)
router.post('/createOrderId',createOrderId)

router.get('/getAllPaymentList',getAllPaymentList)
router.get('/getSinglePaymentDetails/:id',getSinglePaymentDetails)

router.get('/packageDetails',superAdminPackageDetails)

module.exports=router