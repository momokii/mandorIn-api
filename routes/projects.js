const router = require('express').Router()
const projectController = require('../controllers/projectController')

const is_auth = require('../middleware/is-auth')
const is_superadmin = require('../middleware/role-checking').is_superadmin
const is_user = require('../middleware/role-checking').is_user

// * ------------------------------ ROUTING ------------------------------ * //

router.get('/history', is_auth, projectController.get_all_projects_history)

router.get('/:id_project', is_auth, //is_superadmin,
    projectController.get_one_project)

router.get('/', is_auth, //is_superadmin,
    projectController.get_all_projects)

router.post('/', is_auth, is_superadmin, projectController.create_project)

router.patch('/done', is_auth, is_superadmin,
    projectController.done_project)

router.patch('/', is_auth, is_superadmin, projectController.edit_project)

router.delete('/', is_auth, is_superadmin, projectController.delete_project)


module.exports = router