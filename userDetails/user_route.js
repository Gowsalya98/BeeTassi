const router=require('express').Router()

const {userBookingCab,getAllUserBookingDetails,userSearch,getAllUserList,getSingleUserDetails, updateUserProfile,deleteUserProfile}=require('./user_controller')

const validationResult=require('../middleware/register_validation')

router.post('/userBookToCab/:id',validationResult.validation,userBookingCab)
router.get('/getAllUserBookingDetails',getAllUserBookingDetails)

router.get('/getAllUserList',getAllUserList)
router.get('/getSingleUserDetails',getSingleUserDetails)

router.put('/updateUserProfile/:userId',updateUserProfile)
router.delete('/deleteUserProfile',deleteUserProfile)

router.get('/search/:key',userSearch)


module.exports=router