const router=require('express').Router()

const ownerControl=require('./owner_controller')

router.get('/ownerGetOurOwnEmployeeList',ownerControl.ownerGetOurOwnEmployeeList)

router.get('/ownerGetOurOwnVehicleList',ownerControl.ownerGetOurOwnVehicleList)

router.get('/owner-cabCount',ownerControl.ownerGetOurOwnVehicleCount)

router.get('/ownergetOurOwnCabBookingHistory',ownerControl.ownergetOurOwnCabBookingHistory)

router.put('/ownerProfile',ownerControl.createOwnerProfileDetails)

router.get('/getAllOwnerList',ownerControl.getAllOwnerList)

router.get('/getSingleOwnerDetails/:id',ownerControl.getSingleOwnerDetails)

router.put('/updateOwnerProfile',ownerControl.updateOwnerProfile)

router.delete('/deleteOwnerProfile',ownerControl.deleteOwnerProfile)


router.get('/search/:key',ownerControl.search)


module.exports=router