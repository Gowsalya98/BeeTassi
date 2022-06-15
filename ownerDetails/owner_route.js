const router=require('express').Router()

const ownerControl=require('./owner_controller')

//owner view booking details 
router.get('/ownerGetOurOwnEmployeeList',ownerControl.ownerGetOurOwnEmployeeList)

router.get('/ownerGetOurOwnVehicleList',ownerControl.ownerGetOurOwnVehicleList)

router.get('/ownergetOurOwnCabBookingHistory',ownerControl.ownergetOurOwnCabBookingHistory)

router.get('/getOurCancelBookingHistory',ownerControl.ownerGetOurCancelBookingHistory)

//owner get own ride details count list
router.get('/owner-cabCount',ownerControl.ownerGetOurOwnVehicleCount)

router.get('/ownTotal-ride',ownerControl.ownerGetOurOwnRideCount)

router.get('/pending-rideCount',ownerControl.pendingRideCount)

router.get('/complete-rideCount',ownerControl.completeRideCount)

router.get('/upcoming-rideCount',ownerControl.upcomingRideCount)

router.get('/cancel-bookingCount',ownerControl.ownerGetCancelBookingCount)

//owner profile details
router.put('/ownerProfile',ownerControl.createOwnerProfileDetails)

router.get('/getAllOwnerList',ownerControl.getAllOwnerList)

router.get('/getSingleOwnerDetails/:id',ownerControl.getSingleOwnerDetails)

router.put('/updateOwnerProfile',ownerControl.updateOwnerProfile)

router.delete('/deleteOwnerProfile',ownerControl.deleteOwnerProfile)


router.get('/search/:key',ownerControl.search)


module.exports=router