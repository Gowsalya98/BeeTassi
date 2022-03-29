

const {body,validationResult}=require('express-validator')


const validation =[
    // body('email').trim().isEmail().toLowerCase().withMessage('email must be valid'),
    body('phoneNumber').isMobilePhone().withMessage('enter the valid phonenumber'),
  
]




module.exports={validation}