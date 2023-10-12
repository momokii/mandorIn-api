const router = require('express').Router()
const cronController = require('../controllers/cronController')
const is_auth = require('../middleware/is-auth')
const is_admin = require('../middleware/role-checking').is_superadmin

// * ------------------------------ ROUTING ------------------------------ * //

router.get('/', is_auth, is_admin, cronController.get_cron_data)

router.post('/switch', is_auth, is_admin, cronController.cron_switch_on_off)

router.patch('/intervals', is_auth, is_admin, cronController.update_change_cron_interval)


module.exports = router


