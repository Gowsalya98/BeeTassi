const router=require('express').Router()

const {addCabDetails,cabDetailImage,getAllCabList,getAllAvailableCabList,getSingleCabDetails,updateCabDetails,deleteCabDetails}=require('../vehicleDetails/vehicle_controller')
const multer=require('../middleware/multer')

router.post('/addCabDetails/:driverId',addCabDetails)

router.post('/image',multer.upload.single('image'),cabDetailImage)

router.get('/getAllCabList',getAllCabList)

router.get('/getAllAvailableCabList',getAllAvailableCabList)

router.get('/getSingleCabDetails/:id',getSingleCabDetails)

router.put('/updateCabDetails',updateCabDetails)

router.delete('/deleteCabDetails/:id',deleteCabDetails)


module.exports=router