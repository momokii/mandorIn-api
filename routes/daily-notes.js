const router = require('express').Router()

const is_auth = require('../middleware/is-auth')
const is_admin = require('../middleware/role-checking').is_admin

// * ------------------------------ ROUTING ------------------------------ * //




module.exports = router