//const Project = require('../models/projects')
//const Workhour = require('../models/workhours')
//const Day = require('../models/days')
//const User = require('../models/users')
//const ProjectWorker = require('../models/project-worker')
const statusCode = require('../utils/status-code').httpStatus_keyValue
const format_date = require('date-fns/format')
const BaseDailyNotes = require('../models/daily-notes-struct')
const date_formatter = require('date-fns')
const mongoose = require('mongoose')

// * gunakan mongoose
const Project = require('../models/project')
const Workhour = require('../models/workhour')
const User = require('../models/user')
const Weather = require('../models/weather')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}


function project_formatted(data) {
    return {
        id : data._id,
        nama: data.nama,
        description: data.description,
        target: data.target,
        start_project: data.start_project,
        end_target_project: data.end_target_project,
        day_work_start : {
            id: data.id_day_work_start._id,
            name: data.id_day_work_start.name
        },
        day_work_last : {
            id: data.id_day_work_last._id,
            name: data.id_day_work_last.name
        },
        workhour: {
            id: data.id_workhour._id,
            jam_masuk: data.id_workhour.jam_masuk,
            jam_selesai: data.id_workhour.jam_selesai,
            jam_istirahat_mulai: data.id_workhour.jam_istirahat_mulai,
            jam_istirahat_selesai: data.id_workhour.jam_istirahat_selesai
        },
        long: data.long,
        lat: data.lat,
        pm: {
            id: data.id_pm._id,
            nama: data.id_pm.nama
        },
        on_progress: data.on_progress,
        on_track: data.on_track,
        //workers: data.workers,
        //daily_notes: data.daily_notes
    }
}



function is_project_done(project, msg){
    if(project.on_progress === false){
        return res.status(statusCode['200_ok']).json({
            errors: false,
            message: msg
        })
    }
}


// * ------------------------------ CONTROLLER ------------------------------ * //
// TODO lakukan testing pada controller ini
exports.get_all_projects_history = async(req, res, next) => {
    try{

        let total_data
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const start_data = (page - 1) * size

        const search = req.query.search || ''

        let project_history
        if(req.role !== 1){
            // * jika admin/ role = 2
            if(req.role === 2){
                total_data = await Project.countDocuments({
                    name : {$regex : search.trim(), $options : "i"},
                    id_pm: req.user_id.toString(),
                    on_progress: false
                })

                project_history = await Project.find({
                    name : {$regex : search.trim(), $options : "i"},
                    id_pm: req.user_id.toString(),
                    on_progress: false
                })
                    .populate({
                        path : 'id_workhour id_pm id_day_work_start id_day_work_last'
                    })
                    .skip(start_data)
                    .limit(size)

            } else {
                // * jika workers / role = 3
                total_data = await Project.countDocuments({
                    name : {$regex : search.trim(), $options : "i"},
                    workers: {$in : [req.user_id.toString()]},
                    on_progress: false
                })

                project_history = await Project.find({
                    name : {$regex : search.trim(), $options : "i"},
                    workers: {$in : [req.user_id.toString()]},
                    on_progress: false
                }).populate({
                    path : "id_workhour id_pm id_day_work_start id_day_work_last"
                }).skip(start_data)
                    .limit(size)
            }

        } else {
            // * jika superadmin / role == 1
            total_data = await Project.countDocuments({
                name : {$regex : search.trim(), $options : "i"},
                on_progress: false
            })

            project_history = await Project.find({
                name : {$regex : search.trim(), $options : "i"},
                on_progress: false
            })
                .populate({
                    path : 'id_workhour id_pm id_day_work_start id_day_work_last'
                })
                .skip(start_data)
                .limit(size)
        }

        const response = project_history.map(data => {
            const project_format = project_formatted(data)
            project_format.workers = data.workers
            return project_format
        })

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapatkan data project history",
            data: {
                total_data: total_data,
                page: page,
                per_page: size,
                projects: response
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_one_project = async (req, res, next) => {
    try{
        const id_project = req.params.id_project
        const project = await Project.findById(id_project)
            .populate({
                path : "id_workhour id_pm id_day_work_start id_day_work_last"
            })
            .populate({
                path: "workers",
                select: "nama"
            })
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * pengcekan user jika yang get bukan SUPERADMIN -> maka yang hanya bisa akses jika admin terlibat merupakan pm project tersebut dan jika user sedang aktif dalam project tersebut
        if(req.role !== 1){
            if(req.role === 2){
                if(project.id_pm._id.toString() !== req.user_id.toString()) {
                    throw_err("Akun tidak punya akses", statusCode['401_unauthorized'])
                }
            } else if(req.role === 3){
                // * get all workersid on project
                const workers = []
                project.workers.forEach(data => {
                    workers.push(data._id.toString())
                })
                // * cek jika user request ada diproject terkait tidak
                if(!workers.includes(req.user_id)){
                    throw_err("Akun tidak punya akses", statusCode['401_unauthorized'])
                }
            }
        }
        // * ---------- ---------- ---------- ---------- ----------

        // * format project response
        const response = project_formatted(project)
        // ? worker properti format
        const workers = project.workers.map(data => {
            return {
                id: data._id,
                nama: data.nama
            }
        })
        // ? -- -- --

        // * project summary data
        const start_date = new Date(project.start_project )
        const end_target_date = new Date(project.end_target_project)
        const total_work_day_now = project.daily_notes.length 
        const total_length_project_target = date_formatter.differenceInDays(end_target_date, start_date)
        const total_length_day_start_now = date_formatter.differenceInDays(start_date, new Date())
        const total_free_day_now = total_length_day_start_now - total_work_day_now
        // * count extra_day
        let total_extra_day = 0
        for (let note of project.daily_notes){
            if(note.is_extra_day === true){
                total_extra_day = total_extra_day + 1
            }
        }
        const project_summary = {
            total_length_project_target: total_length_project_target,
            total_day_from_start_now: total_length_day_start_now,
            total_work_day_now : total_work_day_now,
            total_non_work_day : total_free_day_now,
            total_extra_day_work : total_extra_day
        }
        response.project_summary = project_summary
        response.workers = workers
        response.daily_notes = project.daily_notes
        // * -----------------------

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Dapatkan satu data project',
            data: response
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_all_projects = async (req, res, next) => {
    try{
        let total_data
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const start_data = (page - 1) * size

        // * misal ada search
        const search = req.query.search || ''
        let all_project

        // * super admin
        if (req.role !== 1){
            if(req.role === 2){
                total_data = await Project.countDocuments({
                    id_pm : req.user_id,
                    nama : {$regex : search.trim() , $options: 'i'}
                })
                all_project = await Project.find({
                    id_pm : req.user_id,
                    nama : {$regex : search.trim(), $options: 'i'}
                }).populate({
                    path : "id_workhour id_pm id_day_work_start id_day_work_last"
                })
                    .skip(start_data)
                    .limit(size)

            // * user (worker)
            } else if(req.role === 3){
                all_project = await Project.find({
                    workers: {$in : [req.user_id.toString()]}
                }).populate({
                    path : "id_workhour id_pm id_day_work_start id_day_work_last"
                })

                total_data = all_project.length

            }
        } else {
            total_data = await Project.countDocuments({
                nama : {$regex : search.trim() , $options: 'i'}
            })
            all_project = await Project.find({
                nama : {$regex : search.trim() , $options: 'i'}
            })
                .populate({
                    path : "id_workhour id_pm id_day_work_start id_day_work_last"
                })
                .skip(start_data)
                .limit(size)
        }

        // * restruktur response projects
        const response = all_project.map(data => {
            const project_format = project_formatted(data)
            project_format.workers = data.workers
            return project_format
        })
        // * ----------------------------

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Data project',
            data: {
                total_data : total_data,
                page: page,
                per_page: size,
                projects: response
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.create_project = async (req, res, next) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const nama_project = req.body.nama
        const deskripsi = req.body.deskripsi
        const target = req.body.target
        const start = new Date(req.body.start_project)
        const end_target = new Date(req.body.end_target_project)
        const longitude = req.body.longitude
        const latitude = req.body.latitude
        const id_workhour = req.body.id_workhour
        const id_day_mulai = parseInt(req.body.id_day_mulai)
        const id_day_selesai = parseInt(req.body.id_day_selesai)
        const id_pm = req.body.id_pm

        const project = {
            nama: nama_project,
            description: deskripsi,
            target: target,
            start_project: req.body.start_project,
            end_target_project: req.body.end_target_project, // mongodb gunakan string saja
            long: longitude,
            lat: latitude,
            id_workhour: id_workhour,
            id_day_work_start: id_day_mulai,
            id_day_work_last: id_day_selesai,
            id_pm: id_pm
        }

        // ! --------------------- FILTER & AUTH USER --------------------- * //

        // * cek jika id_day_work_start atau id_day_work_last <1 atau >8
        if((id_day_mulai < 1 || id_day_mulai > 7) || (id_day_selesai < 1 || id_day_selesai > 7)){
            throw_err("Kode hari tidak sesuai", statusCode['400_bad_request'])
        }

        // * cek jika waktu target < daripada waktu start (tidak masuk akal) & cek tanggal start minimal adalah h+1 dari hari sekarang
        if(!(end_target >= start)){
            throw_err("Waktu target pengerjaan lebih kecil dari awal pengerjaan", statusCode['400_bad_request'])
        }
        const today = new Date()
        today.setHours(7, 0, 0, 0) // * set hours=7 -> untuk agar waktu dapat sama dengan waktu indonesia
        if(start <= today){
            throw_err("Minimal set tanggal start proyek adalah h+1 dari hari ini", statusCode['400_bad_request'])
        }

        // * cek id workhour dan pm apakah ada atau tidak
        const check_workhour = await Workhour.findById(id_workhour)
        const user_pm = await User.findById(id_pm)
        if(!user_pm || !check_workhour){
            throw_err("Terjadi kesalahan saat proses waktu kerja / project manager, silahkan reload halaman", statusCode['400_bad_request'])
        }

        // * --------------------- --------------------- ---------------------

        // * check jika ada project yang benar benar deskripsinya sama persis -> proses gagal
        const check_project = await Project.findOne({
                ...project
        })
        if(check_project){
            throw_err("Project dengan data sama persis sudah ada, coba cek data input kembali", statusCode['400_bad_request'])
        }

        // ! --------------------- ----------------- --------------------- * //

        // * buat dahulu namun belum disimpan
        const new_project = new Project({
            ...project
        })
        new_project.workers = [] // * inisiasi tempat data workers

        // * kemudian setelah buat project baru -> cek dahulu apakah user diinputkan sudah dilibatkan dalam project lain atau belum dan sedang aktif
        const user_project = req.body.id_users
        for(let id_user of user_project){
            const user = await User.findById(id_user)
            if(user && (user.id_role === 3) && (user.id_project === null)){

                // * beda konsep penggunaan dengan mongoose, karena user sudah ada properti sndiri untuk cek bahwa dia sedang ada project aktif atau tidak
                user.id_project = new_project._id.toString() //* tambah user untuk punya project sedang dikrejakan
                // * tambah data user ke daftar pekerja di project
                new_project.workers.push(user._id.toString())
                await user.save()

            } else {
                console.log('User on duty')
            }
        }

        // ? ------------------ buat Daily Weather Document sebelum save project baru ------------------

        const new_weather = new Weather({
            id_project : new_project._id.toString()
        })

        // ? ---------------------- --------------------------------------------- ----------------------

        // * kemudian sebelum save project baru juga ubah/ tambah data project yang dikerjakan oleh pm
        user_pm.projects.push(new_project._id)
        await new_project.save({session})
        await user_pm.save({session})
        await new_weather.save({session})

        await session.commitTransaction()
        session.endSession()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil tambah project baru'
        })

    } catch (e) {
        await session.abortTransaction()
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.done_project = async (req, res, next) => {
    try{
        /*
            * sekarang dibuat -> hanya bisa dilakukan/ akses oleh PM/ super admin
         */

        const project = await Project.findById(req.body.id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        /*
            * -------------------------------------------------------------------
            * sekarang dibuat -> hanya bisa dilakukan/ akses oleh PM/SuperAdmin
            * -------------------------------------------------------------------
         */
        if(req.role !== 1 && req.user_id.toString() !== project.id_pm.toString()){
            throw_err('Akun tidak punya akses', statusCode['401_unauthorized'])
        }

        // project.on_progress = false // ! versi benar
        // * ------------------- ------------------- ------------------- -------------------
        // * dev version (jika di post lagi maka akan kembalikan misal dari true -> false -> true)
        // * ------------------- ------------------- ------------------- -------------------
        if(project.on_progress === true){
            project.on_progress = false
        } else {
            project.on_progress = true
        }
        /*
            * catatan
            * mungkin nantinya ketika project selesai bisa berikan tambahan properti -> misal ada catatan selama project dikerjakan dll.
            *
            ! juga ketika project selesai maka nanti harusnya
            * unlink data id project di workers/user/ role = 3
            * hapus data pm pada array di pm/user/role = 2
         */
        // * ----------------------

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil ubah status proyek menjadi selesai'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.edit_project = async (req, res, next) => {
    try{
        const id_project = req.body.id_project
        const nama = req.body.nama
        const description = req.body.description
        const target = req.body.target

        // ! --------------------- FILTER & AUTH USER --------------------- * //

        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }


        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")

        // ! --------------------- ----------------- --------------------- * //

        if(nama !== '' && nama !== null){
            project.nama = nama
        }

        if(description !== '' && description !== null){
            project.description = description
        }

        if(target !== '' && target !== null){
            project.target = target
        }

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil ubah data informasi project'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.delete_project = async (req, res, next) => {
    try{


        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil hapus data project'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}

