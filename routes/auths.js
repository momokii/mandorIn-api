const router = require('express').Router()
const authController = require('../controllers/authControllers')
const is_auth = require('../middleware/is-auth')

// * ------------------------------ ROUTING ------------------------------ * //

router.post('/login', authController.login)

router.post('/logout', is_auth,
    authController.logout)



module.exports = router


