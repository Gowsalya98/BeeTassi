const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const {register}=require('../superControll/superAdmin_model')

exports.superAdminRegistration =((req, res) => {
    try {
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) res.json({ message: errors.array() })
        else { 
            register.countDocuments({ email: req.body.email }, async (err, num) => {
                console.log(num)
                if (num == 0) {
                    req.body.password = await bcrypt.hashSync(req.body.password, 10)
                    register.create(req.body, (err, data) => {
                        if(err)throw err
                        res.status(200).send({message:"register successfully",data })
                    })
                }else { res.send({ message: 'Data already exists' }) }
            })
        }
    } catch (err) {
        res.status(500).send({message:err.message})
    }
})

exports.superAdminLogin = ((req, res) => {
    try {
        console.log('line 29',req.body)
        register.findOne({ email: req.body.email },async(err, data) => {
            console.log('line 31',data)
            if (data) {
                const password = await bcrypt.compare(req.body.password, data.password)
                // console.log(password)
                if (password === true) {
                    const token = jwt.sign({ _id: data._id }, 'secret')
                    res.status(200).send({ message: "login successfully",token,data })
                }
                else { res.status(400).send('invalid password') }
            }
            else {
                console.log('invalid email/password')
                res.status(400).send({ message: 'invalid email/password '})
            }
        })
    } catch (error) {
        res.status(500).send({message:err.message})
    }
})
