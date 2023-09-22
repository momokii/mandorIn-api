const statusCode = require('../utils/status-code').httpStatus_keyValue
const Project = require('../models/project')
const User = require('../models/user')


// * - total project sedang off/pending (jika jadi diimplementasikan)
exports.get_dashboard = async (req, res, next) => {
    try{
        const total_project = await Project.find().countDocuments()
        const total_project_on_progress = await Project.find({
            on_progress : true
        }).countDocuments()
        const total_project_done = total_project - total_project_on_progress
        //const total_pending_project = 0 // tba
        const total_user_worker = await User.find({id_role: 3}).countDocuments()
        const total_user_admin = await User.find({id_role: 2}).countDocuments()
        const total_user = total_user_admin + total_user_worker
        const total_free_worker = await User.find({
            id_role: 3,
            id_project: null
        }).countDocuments()
        const total_free_admin = await User.find({
            id_role: 2,
            projects : {$size : 0}
        }).countDocuments()
        const total_work_worker = total_user_worker - total_free_worker
        const total_work_admin = total_user_admin - total_free_admin

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Data dashboard",
            data: {
                total_project: total_project,
                total_project_done: total_project_done,
                total_project_on_progress: total_project_on_progress,
                total_user: total_user,
                total_worker : total_user_worker,
                total_work_worker: total_work_worker,
                total_free_worker: total_free_worker,
                total_admin: total_user_admin,
                total_work_admin: total_work_admin,
                total_free_admin: total_free_admin
            }
        })

    } catch(e){
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}