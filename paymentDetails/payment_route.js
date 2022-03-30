const router=require('express').Router()

const {createPayment,getAllPaymentList,getSinglePaymentDetails}=require('./payment_controller')

router.post('/createPayment/:id',createPayment)

router.get('/getAllPaymentList',getAllPaymentList)
router.get('/getSinglePaymentDetails/:id',getSinglePaymentDetails)

module.exports=router