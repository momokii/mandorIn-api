const router = require('express').Router()
const dayController = require('../controllers/dayController')

const is_auth = require('../middleware/is-auth')
const is_superadmin = require('../middleware/role-checking').is_superadmin


// * ------------------------------ ROUTING ------------------------------ * //

router.get('/', is_auth, is_superadmin,
    dayController.get_days)


module.exports = router