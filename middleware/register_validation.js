

const {body,validationResult}=require('express-validator')


const validation =[
    body('contact').isMobilePhone().withMessage('enter the valid phonenumber'),
    body('email').trim().isEmail().withMessage('email  must be valid'),
    body('password').isLength({ min: '5', max:'10'}).withMessage('password must be minimum 5 character')
  
]
const valid=[
    body('contact').isMobilePhone().withMessage('enter the valid phonenumber'),
    body('email').trim().isEmail().withMessage('email  must be valid')
]

module.exports={validation,valid}