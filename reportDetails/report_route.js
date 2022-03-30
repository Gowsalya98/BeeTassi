const router=require('express').Router()

const {reportForTaxi,getAllReportList,getSingleReportDetails,userDeleteOurOwnReportDetails}=require('./report_controller')

const multer=require('../middleware/multer')

router.post('/report/:id',multer.upload.single('taxiImage'),reportForTaxi)

router.get('/getAllReportList',getAllReportList)
router.get('/getSingleReportDetails/:id',getSingleReportDetails)

router.delete('/userDeleteOurOwnReportDetails/:id',userDeleteOurOwnReportDetails)

module.exports=router