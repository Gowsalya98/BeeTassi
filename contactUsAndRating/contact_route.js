const router=require('express').Router()

const contactUsControl=require('./contact_controller')

//Contact Details
router.post('/createContactdetails',contactUsControl.createContactdetails)

router.get('/getAllContactUsList',contactUsControl.getAllContactUsList)

router.get('/getSingleContactUsDetails/:id',contactUsControl.getSingleContactUsDetails)

//rating
router.post('/rating',contactUsControl.ratingForCab)

//about us
router.post('/create-aboutUs',contactUsControl.createAboutUs)

router.get('/getAll-aboutUs',contactUsControl.getAllAboutUsDetails)

router.get('/getSingle-aboutUs/:id',contactUsControl.getSingleAboutUs)

router.put('/update-aboutUs/:id',contactUsControl.updateAboutUs)

router.delete('/delete-aboutUs/:id',contactUsControl.deleteAboutUs)

module.exports=router