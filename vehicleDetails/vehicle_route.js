const router=require('express').Router()

const {addCabDetails,cabDetailImage,getAllCabList,getSingleCabDetails,updateCabDetails,deleteCabDetails}=require('../vehicleDetails/vehicle_controller')
const multer=require('../middleware/multer')

router.post('/addCabDetails',addCabDetails)
router.post('/image',multer.upload.single('image'),cabDetailImage)

router.get('/getAllCabList',getAllCabList)
router.get('/getSingleCabDetails/:id',getSingleCabDetails)

router.put('/updateCabDetails',updateCabDetails)
router.delete('/deleteCabDetails/:id',deleteCabDetails)


module.exports=router