const router = require('express').Router()

const {superAdminRegister,superAdminLogin,forgetPassword,adminAcceptOwnerDetails,adminRejectOwnerDetails} = require('./superAdmin_controller')

const validation = require('../register/register_model')

router.post('/register', validation.validation,superAdminRegister)

router.post('/login', validation.validation,superAdminLogin)

router.post('/forgetPassword',validation.validation,forgetPassword)

router.get('/accept-owner/:ownerId',adminAcceptOwnerDetails)

router.get('/reject-owner/:ownerId',adminRejectOwnerDetails)

module.exports = router