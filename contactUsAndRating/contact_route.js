const router=require('express').Router()

const contactUsControl=require('./contact_controller')

router.post('/createContactdetails',contactUsControl.createContactdetails)

router.get('/getAllContactUsList',contactUsControl.getAllContactUsList)

router.get('/getSingleContactUsDetails/:id',contactUsControl.getSingleContactUsDetails)


//rating

router.post('/rating',contactUsControl.ratingForCab)

module.exports=router