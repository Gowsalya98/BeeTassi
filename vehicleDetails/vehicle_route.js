const router=require('express').Router()

const {addVehicleDetails,getAllVehicleList,getSingleVehicleDetails,ownerGetOurOwnVehicleList,updateVehicleDetails,deleteVehicleDetails}=require('../vehicleDetails/vehicle_controller')
const multer=require('../middleware/multer')

router.post('/addVehicleDetails',multer.upload.single('vehicleImage'),addVehicleDetails)

router.get('/ownerGetOurOwnVehicleList',ownerGetOurOwnVehicleList)

router.get('/getAllVehicleList',getAllVehicleList)
router.get('/getSingleVehicleDetails/:id',getSingleVehicleDetails)

router.put('/updateVehicleDetails',updateVehicleDetails)
router.delete('/deleteVehicleDetails',deleteVehicleDetails)


module.exports=router