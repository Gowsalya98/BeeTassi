const router=require('express').Router()
const {register,login}=require('./register_controller')
const valid=require('./register_model')
const multer=require('../middleware/multer')

router.post('/register',multer.upload.single('profileImage'),valid.validation,register)
router.post('/login',valid.validation,login)


module.exports=router