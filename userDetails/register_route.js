const router=require('express').Router()
const {registerForUserAndOwner,login,userBookingCab,getAllUserBookingDetails,getAllUserList,getSingleUserDetails, updateUserProfile,deleteUserProfile}=require('../userDetails/register_controller')
const validationResult=require('../middleware/register_validation')
const valid=require('../superControll/superAdmin_model')
const multer=require('../middleware/multer')


router.post('/register',valid.validation,multer.upload.single('profileImage'),registerForUserAndOwner)
router.post('/login',valid.validation,login)

router.get('/getAllUserList',getAllUserList)
router.get('/getSingleUserDetails',getSingleUserDetails)

router.put('/updateUserProfile',updateUserProfile)
router.delete('/deleteUserProfile',deleteUserProfile)


router.post('/userBookToCab',validationResult.validation,userBookingCab)
router.get('/getAllUserBookingDetails',getAllUserBookingDetails)


module.exports=router