const router=require('express').Router()
const {register,login,registerImage}=require('./register_controller')
const valid=require('./register_model')
const multer=require('../middleware/multer')

router.post('/register',valid.validation,register)
router.post('/image',multer.upload.single('image'),registerImage)
router.post('/login',valid.validation,login)


module.exports=router