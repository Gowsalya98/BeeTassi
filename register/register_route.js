const router=require('express').Router()
const registerControl=require('./register_controller')
const valid=require('./register_model')
const validation=require('../middleware/register_validation')
const multer=require('../middleware/multer')

router.post('/register',validation.validation,registerControl.registerForAll)

router.post('/verifyOtp',registerControl.verificationOtp)

router.post('/image',multer.upload.single('image'),registerControl.registerImage)

router.post('/login',valid.validation,registerControl.login)

router.post('/forgetPassword',validation.validation,registerControl.forgetPassword)

router.get('/total-user',registerControl.TotalUser)

router.get('/total-owner',registerControl.TotalOwner)

router.get('/today-user',registerControl.TodayUser)

router.get('/today-owner',registerControl.TodayOwner)

module.exports=router