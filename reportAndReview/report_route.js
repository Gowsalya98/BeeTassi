const router=require('express').Router()

const reportControl=require('./report_controller')

router.post('/report',reportControl.reportForTaxi)

router.get('/getAllReportList',reportControl.getAllReportList)
router.get('/getSingleReportDetails/:id',reportControl.getSingleReportDetails)

router.delete('/userDeleteOurOwnReportDetails/:id',reportControl.userDeleteOurOwnReportDetails)

//review

router.post('/review',reportControl.reviewForCab)

module.exports=router