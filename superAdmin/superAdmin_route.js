const router = require('express').Router()

const {superAdminRegister,superAdminLogin} = require('./superAdmin_controller')

const validation = require('../register/register_model')

router.post('/register', validation.validation,superAdminRegister)

router.post('/login', validation.validation,superAdminLogin)

module.exports = router