const router=require('express').Router()
const {register,login}=require('./register_controller')
const valid=require('./register_model')
const multer=require('../middleware/multer')

router.post('/register',valid.validation,multer.upload.single('profileImage'),register)
router.post('/login',valid.validation,login)


module.exports=router