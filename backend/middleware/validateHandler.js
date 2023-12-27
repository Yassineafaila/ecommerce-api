const { body, validationResult } = require('express-validator')
const userLoginValidationRules = () => {
  console.log("im right now validtaing")
  return [
    
    //email must be full
    body('email',"email is empty").not().isEmpty(),
    // the email  must be an email
    body("email","it's not a valide email").isEmail(),
    // password must be at least 8 chars long
    body('password',"password must be at least 8 characters").isLength({ min: 6 }),
  ]
}
const userRegisterValidationRules=()=>{
    return[
        // name must not be empty
        body("name","name is empty").not().isEmpty(),
        // email must not be empty
        body("email","email is empty").not().isEmpty(),
        //email must be an valide email
        body("email","must be a valid email").isEmail(),
        // password must be at least 8 chars long
        body("password","password must be at least 8 characters").isLength({min:8})
    ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors)
  console.log('error happened')
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }))
  console.log(extractedErrors)
  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
    userLoginValidationRules,
    userRegisterValidationRules,
  validate,
}