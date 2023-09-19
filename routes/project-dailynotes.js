const router = require('express').Router()
const projectDailyNotesController = require('../controllers/project-dailynotesController')

const is_auth = require('../middleware/is-auth')
//const is_superadmin = require('../middleware/role-checking').is_superadmin
const is_user = require('../middleware/role-checking').is_user

const process_file = require('../middleware/file-upload')


// * ------------------------------ PROJECT DAILY NOTES ------------------------------ * //

// ! ------- GET -------

router.get('/workers', is_auth, is_user, projectDailyNotesController.get_workers_daily_notes_summary)

router.get('/finances', is_auth, projectDailyNotesController.get_daily_notes_finance_summary)

router.get('/', is_auth, projectDailyNotesController.get_daily_notes)


// ! ------- POST -------

router.post('/workers/delete', is_auth, is_user, projectDailyNotesController.workers_delete_post_notes)

router.post('/workers', is_auth, is_user,
    // * nantinya hanya user worker saja yang bisa akses
    projectDailyNotesController.workers_post_notes)

router.post('/attendances/confirm', is_auth,
    // * sekarang hanya bisa diakses oleh superadmin dan admin project terkait
    projectDailyNotesController.daily_attendances_confirmation)

router.post('/attendances', is_auth, is_user, projectDailyNotesController.post_attendance_workers)

router.post('/tomorrow', is_auth,
    // * sekarang hanya bisa diakses oleh superadmin dan admin project terkait
    projectDailyNotesController.post_notes_tomorrow)

router.post('/confirm', is_auth,
    projectDailyNotesController.daily_confirmation_done)

router.post('/:finance/delete', is_auth, projectDailyNotesController.delete_incomes_expenses)

router.post('/:finance', is_auth, process_file, projectDailyNotesController.post_incomes_expenses)

router.post('/', is_auth, projectDailyNotesController.post_dailynotes)

// * ------------------------------ ------------------- ------------------------------ * //



module.exports = router