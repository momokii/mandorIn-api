const router = require('express').Router()
const dashboardController = require('../controllers/dashboardController')
const is_auth = require('../middleware/is-auth')


router.get('/', is_auth, dashboardController.get_dashboard)


module.exports = router
