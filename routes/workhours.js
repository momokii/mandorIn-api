const router = require('express').Router()
const workhourController = require('../controllers/workHourControllers')

const is_auth = require('../middleware/is-auth')
const is_superadmin = require('../middleware/role-checking').is_superadmin


// * ------------------------------ ROUTING ------------------------------ * //

router.get('/:id_workhour', is_auth, is_superadmin,
    workhourController.get_one_workhour)

router.get('/', is_auth, is_superadmin,
    workhourController.get_workhours)

router.post('/', is_auth, is_superadmin,
    workhourController.create_workhour)

router.patch('/', is_auth, is_superadmin,
    workhourController.edit_workhour)

router.delete('/', is_auth, is_superadmin,
    workhourController.delete_workhour)


module.exports = router