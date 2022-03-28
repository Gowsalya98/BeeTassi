const router=require('express').Router()
const {superAdminRegistration,superAdminLogin}=require('./superAdmin_controller')
const valid=require('../superControll/superAdmin_model')

router.post('/register',valid.validation,superAdminRegistration)
router.post('/login',valid.validation,superAdminLogin)

module.exports=router