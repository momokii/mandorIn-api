const router = require('express').Router()
const projectController = require('../controllers/projectController')

const is_auth = require('../middleware/is-auth')
const is_superadmin = require('../middleware/role-checking').is_superadmin

// * ------------------------------ ROUTING ------------------------------ * //

router.get('/:id_project', is_auth, //is_superadmin,
    projectController.get_one_project)

router.get('/', is_auth, //is_superadmin,
    projectController.get_all_projects)


// * ------------------------------ PROJECT DAILY NOTES ------------------------------ * //

router.post('/daily-notes/workers', is_auth,
    // * nantinya hanya user worker saja yang bisa akses
    projectController.workers_post_notes)

router.post('/daily-notes/confirm', is_auth,
    projectController.daily_confirmation_done)

router.post('/daily-notes/:finance', is_auth, projectController.post_incomes_expenses)

router.post('/daily-notes', is_auth, projectController.post_dailynotes)

// * ------------------------------ ------------------- ------------------------------ * //


router.post('/', is_auth, is_superadmin, projectController.create_project)

router.patch('/:id_project/done', is_auth, //is_superadmin,
    projectController.done_project)

router.patch('/', is_auth, is_superadmin, projectController.edit_project)

router.delete('/', is_auth, is_superadmin, projectController.delete_project)


module.exports = router