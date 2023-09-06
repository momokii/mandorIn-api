const router = require('express').Router()
const rolesController = require('../controllers/roleControllers')
const is_auth = require('../middleware/is-auth')
const is_superadmin = require('../middleware/role-checking').is_superadmin

// * ------------------------------ ROUTING ------------------------------ * //


router.get('/', is_auth, is_superadmin,
    rolesController.get_roles)

router.patch('/', is_auth, is_superadmin,
    rolesController.edit_roles_name)


module.exports = router

