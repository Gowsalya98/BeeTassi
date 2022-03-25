const router=require('express').Router()
const {superAdminRegistration,superAdminLogin}=require('./superAdmin_controller')
const valid=require('../superControll/superAdmin_model')

router.post('/superAdminRegister',valid.validation,superAdminRegistration)
router.post('/superAdminLogin',valid.validation,superAdminLogin)

module.exports=router