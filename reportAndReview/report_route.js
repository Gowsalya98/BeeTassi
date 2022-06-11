const router=require('express').Router()

const reportControl=require('./report_controller')

router.post('/createReport/:cabId',reportControl.createReport)

router.get('/getAllReportList',reportControl.getAllReportList)

router.get('/getSingleReportDetails/:reportId',reportControl.getSingleReportDetails)

router.delete('/userDeleteOurOwnReportDetails/:reportId',reportControl.userDeleteOurOwnReportDetails)

//review

router.post('/createReview/:cabId',reportControl.createReview)

router.get('/getAllReview',reportControl.getAllReview)

router.get('/getSingleReview/:reviewId',reportControl.getSingleReview)

router.delete('/deleteReview/:reviewId',reportControl.userDeleteOurOwnReview)


module.exports=router