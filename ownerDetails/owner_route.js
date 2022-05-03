const router=require('express').Router()

const {search,getAllOwnerList,ownerGetOurOwnEmployeeList,ownerGetOurOwnVehicleList,getSingleOwnerDetails,updateOwnerProfile,deleteOwnerProfile}=require('./owner_controller')

router.get('/ownerGetOurOwnEmployeeList',ownerGetOurOwnEmployeeList)
router.get('/ownerGetOurOwnVehicleList',ownerGetOurOwnVehicleList)

router.get('/getAllOwnerList',getAllOwnerList)
router.get('/getSingleOwnerDetails/:id',getSingleOwnerDetails)

router.put('/updateOwnerProfile',updateOwnerProfile)
router.delete('/deleteOwnerProfile',deleteOwnerProfile)


router.get('/search/:key',search)


module.exports=router