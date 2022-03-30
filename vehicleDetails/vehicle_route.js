const router=require('express').Router()

const {addVehicleDetails,vehicleDetailsImage,getAllVehicleList,getSingleVehicleDetails,updateVehicleDetails,deleteVehicleDetails}=require('../vehicleDetails/vehicle_controller')
const multer=require('../middleware/multer')

router.post('/addVehicleDetails',multer.upload.single('vehicleImage'),addVehicleDetails)
router.post('/image',multer.upload.single('image'),vehicleDetailsImage)

router.get('/getAllVehicleList',getAllVehicleList)
router.get('/getSingleVehicleDetails/:id',getSingleVehicleDetails)

router.put('/updateVehicleDetails',updateVehicleDetails)
router.delete('/deleteVehicleDetails/:id',deleteVehicleDetails)


module.exports=router