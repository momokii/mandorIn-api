const statusCode = require('../utils/status-code').httpStatus_keyValue
//* change using nosql database
const WorkHour = require('../models/workhour')
const Project = require('../models/project')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ CONTROLLER ------------------------------ * //

exports.get_one_workhour = async (req, res, next) => {
    try{
        const id_workhour = req.params.id_workhour
        const workhour = await WorkHour.findById(id_workhour)
            .select("jam_masuk jam_selesai jam_istirahat_mulai jam_istirahat_selesai")
        if(!workhour){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapatkan satu data workhour",
            data: {
                id: workhour._id,
                jam_masuk: workhour.jam_masuk,
                jam_selesai: workhour.jam_selesai,
                jam_istirahat_mulai: workhour.jam_istirahat_mulai,
                jam_istirahat_selesai: workhour.jam_istirahat_selesai
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_workhours = async (req, res, next) => {
    try{
        // * PAGINATION
        const total_data = await WorkHour.countDocuments()
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const start_data = (page - 1) * size

        const all_workhours = await WorkHour.find()
            .skip(start_data)
            .limit(size)
            .select("jam_masuk jam_selesai jam_istirahat_mulai jam_istirahat_selesai")

        const data = all_workhours.map(workhour => {
            return {
                id: workhour._id,
                jam_masuk: workhour.jam_masuk,
                jam_selesai: workhour.jam_selesai,
                jam_istirahat_mulai: workhour.jam_istirahat_mulai,
                jam_istirahat_selesai: workhour.jam_istirahat_selesai
            }
        })

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Data Waktu Kerja',
            data: {
                total_data: total_data,
                page: page,
                per_page: size,
                workhours: data
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.create_workhour = async (req, res, next) => {
    try{
        const mulai = req.body.mulai
        const selesai = req.body.selesai
        const istirahat_mulai = req.body.istirahat_mulai
        const istirahat_selesai = req.body.istirahat_selesai


        const check_time = await  WorkHour.findOne({
                jam_masuk: mulai,
                jam_selesai: selesai,
                jam_istirahat_mulai: istirahat_mulai,
                jam_istirahat_selesai: istirahat_selesai
        })

        if(check_time){
            throw_err("Jadwal yang diinputkan sudah ada dalam sistem, proses tambah gagal", statusCode['400_bad_request'])
        }

        let newWorkhour = new WorkHour ({
            jam_masuk: mulai,
            jam_selesai: selesai,
            jam_istirahat_mulai: istirahat_mulai,
            jam_istirahat_selesai: istirahat_selesai
        })

        await newWorkhour.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil tambah data informasi waktu kerja'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.edit_workhour = async (req, res, next) => {
    try{
        const edit_workhour = await WorkHour.findById(req.body.id_workhour)
        if(!edit_workhour){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        const mulai = req.body.mulai
        const selesai = req.body.selesai
        const istirahat_mulai = req.body.istirahat_mulai
        const istirahat_selesai = req.body.istirahat_selesai

        const check_time = await WorkHour.findOne({
            jam_masuk: mulai,
            jam_selesai: selesai,
            jam_istirahat_mulai: istirahat_mulai,
            jam_istirahat_selesai: istirahat_selesai

        })

        if(check_time && check_time.id !== req.body.id_workhour){
            throw_err("Jadwal yang diinputkan sudah ada dalam sistem, proses tambah gagal", statusCode['400_bad_request'])
        }

        edit_workhour.jam_masuk = mulai
        edit_workhour.jam_selesai = selesai
        edit_workhour.jam_istirahat_mulai = istirahat_mulai
        edit_workhour.jam_istirahat_selesai = istirahat_selesai

        await edit_workhour.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil ubah data informasi waktu kerja'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.delete_workhour = async (req, res, next) => {
    try{
        const del_workhour = await WorkHour.findById(req.body.id_workhour)
        if(!del_workhour){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        const project_check = await Project.find({
            id_workhour: req.body.id_workhour
        })

        let is_used = false

        if(project_check){
            for (let project of project_check){
                if(project.on_progress){
                    is_used = true
                    break
                }
            }

            if(is_used){
                throw_err("Workhour sedang digunakan dalam project aktif, tidak bisa hapus", statusCode['401_unauthorized'])
            }
        }

        await WorkHour.findByIdAndDelete(req.body.id_workhour)

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil hapus data waktu kerja'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}