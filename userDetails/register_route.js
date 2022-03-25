const router=require('express').Router()
const {registerForUser,login,userBookingCab,getAllUserList,getSingleUserDetails, updateUserProfile,deleteUserProfile}=require('../userDetails/register_controller')
const validationResult=require('../middleware/register_validation')
const valid=require('../superControll/superAdmin_model')


router.post('/register',valid.validation,registerForUser)
router.post('/login',valid.validation,login)
router.get('/getAllUserList',getAllUserList)
router.get('/getSingleUserDetails',getSingleUserDetails)
router.put('/updateUserProfile',updateUserProfile)
router.delete('/deleteUserProfile',deleteUserProfile)


router.post('/userBookToCab',validationResult.validation,userBookingCab)


module.exports=router