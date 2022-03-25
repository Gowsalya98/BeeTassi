const router=require('express').Router()

const {registerForOwnerDetails,login,search,getAllOwnerList,getSingleOwnerDetails,updateOwnerProfile,deleteOwnerProfile}=require('./owner_controller')
const valid=require('../superControll/superAdmin_model')
const multer=require('../middleware/multer')

router.post('/register',multer.upload.single('profileImage'),valid.validation,registerForOwnerDetails)
router.post('/login',valid.validation,login)
router.get('/getAllOwnerList',getAllOwnerList)
router.get('/getSingleOwnerDetails',getSingleOwnerDetails)
router.put('/updateOwnerProfile',updateOwnerProfile)
router.delete('/deleteOwnerProfile',deleteOwnerProfile)


router.get('/search/:key',search)


module.exports=router