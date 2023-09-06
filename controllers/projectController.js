//const Project = require('../models/projects')
//const Workhour = require('../models/workhours')
//const Day = require('../models/days')
//const User = require('../models/users')
//const ProjectWorker = require('../models/project-worker')
const statusCode = require('../utils/status-code').httpStatus_keyValue
const format_date = require('date-fns/format')
const BaseDailyNotes = require('../models/daily-notes-struct')

// * gunakan mongoose
const Project = require('../models/project')
const Workhour = require('../models/workhour')
const Day = require('../models/day')
const User = require('../models/user')

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


function is_superadmin_or_admin_pm(req, pm_id) {
    if(req.role !== 1 && (req.user_id.toString() !== pm_id.toString())) {
        throw_err("Akun tidak punya akses", statusCode['404_not_found'])
    }
}


// * fungsi untuk filtering -> ketika daily confirmation = true -> maka data pada hari tersebut sudah tidak bisa di edit lagi
function is_daily_confirmation_true(daily_note){
    if(daily_note.daily_confirmation){
        throw_err("Data harian sudah dikunci, edit tidak bisa dilakukan", statusCode['401_unauthorized'])
    }
}



// * ------------------------------ CONTROLLER ------------------------------ * //

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

        if (req.role !== 1){
            if(req.role === 2){
                total_data = await Project.countDocuments({ id_pm : req.user_id })
                all_project = await Project.find({
                    id_pm : req.user_id
                }).populate({
                    path : "id_workhour id_pm id_day_work_start id_day_work_last"
                })
                    .skip(start_data)
                    .limit(size)

            } else if(req.role === 3){
                all_project = await Project.find({
                    workers: {$in : [req.user_id.toString()]}
                }).populate({
                    path : "id_workhour id_pm id_day_work_start id_day_work_last"
                })

                total_data = all_project.length

            }
        } else {
            total_data = await Project.countDocuments()
            all_project = await Project.find()
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

        // * buat dahulu namun belum disimpan
        const new_project = new Project({
            ...project
        })
        new_project.workers = [] // * inisiasi tempat data workers

        // * kemudian setelah buat project baru -> cek dahulu apakah user diinputkan sudah dilibatkan dalam project lain atau belum dan sedang aktif
        const user_project = req.body.id_users
        for(id_user of user_project){
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

        // * kemudian sebelum save project baru juga ubah/ tambah data project yang dikerjakan oleh pm
        user_pm.projects.push(new_project._id)
        await new_project.save()
        await user_pm.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Berhasil tambah project baru'
        })

    } catch (e) {
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

        const project = await Project.findById(req.params.id_project)
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
        const nama = req.body.nama
        const dscription = req.body.description
        const target = req.body.target


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



// * -------------------------------- PROJECT DAILY NOTES ------------------------------ * //

exports.workers_post_notes = async (req, res, next) => {
    try{
        const data = req.body.data
        const id_project = req.body.id_project
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const workers = await User.findById(req.user_id)
        if(!workers){
            throw_err("Token Error, Akun tidak ditemukan", statusCode['404_not_found'])
        }

        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data project tidak ditemukan", statusCode['404_not_found'])
        }

        // * cek user terlibat dalam project terkait atau tidak
        if(workers.id_project !== project._id.toString()){
            throw_err("User tidak terlibat dalam project terkait", statusCode['401_unauthorized'])
        }
        // ! --------------------------- ----------------- --------------------------- * //

        // * hanya bisa mengisi daily notes dari data hari tersebut
        const today_date = new Date()
        const formatted_date = format_date(today_date, "yyyy-MM-dd")

        for (data_notes of project.daily_notes){
            if(data_notes.date.toString() === formatted_date.toString()){
                // * tidak bisa edit/ tambah ketika daily confirmation sudah true
                if(data_notes.daily_confirmation === true){
                    throw_err("Catatan harian sudah ditutup", statusCode['401_unauthorized'])
                }

                // ! filter tambahan--> cek daily confirmation sudah TRUE belum
                is_daily_confirmation_true(data_notes)

                // * cari apakah sudah buat notes atau belum, jika belum maka buat dan jika sudah maka hanya update notes terkait
                let is_create = false
                for(note of data_notes.workers_notes){
                    if(note.id_user.toString() === req.user_id){
                        // * karena ada -> maka update saja
                        note.data = data
                        is_create = true
                        break
                    }
                }

                if(is_create) {
                    break
                } else {
                    // * tidak ditemukan, maka buat data baru
                    const worker_note = {
                        id_user : req.user_id,
                        data : data
                    }
                    data_notes.workers_notes.push(worker_note)
                }
            }
        }

        // * simpan worker note
        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Workers berhasil post daily notes"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}




exports.daily_confirmation_done = exports.template = async (req, res, next) => {
    try{
        /*
            * catatan
            * untuk sekarang ADMIN hanya bisa konfirmasi
            * SUPERADMIN juga hanya bisa BATALKAN
         */

        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        // * jika request bukan admin dan juga bukan superadmin
        if(req.role === 3 ){
            throw_err("Akun tidak punya akses", statusCode['404_not_found'])
        }

        const user = await User.findById(req.user_id)
        if(!user){
            throw_err("Token error, akun tidak ditemukan", statusCode['401_unauthorized'])
        }

        const project = await Project.findById(req.body.id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * cek jika bukan superadmin dan juga bukan admin dari project terkait
        is_superadmin_or_admin_pm(req, project.id_pm.toString())
        // ! --------------------------- ----------------- --------------------------- * //

        // * cari daily notes hari ini
        const today_date = new Date()
        const formatted_date = format_date(today_date, "yyyy-MM-dd")

        for (note of project.daily_notes){
            if(note.date.toString() === formatted_date.toString()){
                // * lakukan pengecekan sesuai role yang diharapkan
                if(req.role === 1){
                    if(note.daily_confirmation === false){
                        throw_err("SuperAdmin hanya bisa membatalkan konfirmasi harian", statusCode['401_unauthorized'])
                    }
                    note.daily_confirmation = false
                } else {
                    if(note.daily_confirmation === true){
                        throw_err("Sudah dilakukan konfirmasi harian, Project Manager hanya bisa melakukan konfirmasi harian", statusCode['401_unauthorized'])
                    }
                    note.daily_confirmation = true
                }
            }
        }

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil ubah status daily notes"
        })
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}




exports.post_incomes_expenses = exports.template = async (req, res, next) => {
    try{
        const ket = req.params.finance
        const total = req.body.total
        const data_post = req.body.data
        const id_project = req.body.id_project

        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const project = await Project.findById(id_project)
        if(!project) {
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * cek jika bukan super admin atau admin dari project terkait
        is_superadmin_or_admin_pm(req, project.id_pm)
        // ! --------------------------- ----------------- --------------------------- * //

        const today_date = new Date()
        const formatted_date = format_date(today_date, "yyyy-MM-dd")

        // * get day now -> dengan iterasi ke semua daily notes terkait
        project.daily_notes.forEach(data => {
            if(data.date.toString() == formatted_date.toString()){

                // ! filter tambahan--> cek daily confirmation sudah TRUE belum
                is_daily_confirmation_true(data_notes)

                if(ket === 'expenses'){
                    data.expenses.data = data_post // string keterangan total harian
                    data.expenses.total = total // number total pengeluarn
                } else if(ket === 'incomes'){
                    data.incomes.data = data_post
                    data.incomes.total = total
                }
            }
        })

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil update keunagan daily notes"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.post_dailynotes = async (req, res, next) => {
    try{
        const id_project = req.body.id_project

        // * --------------------------- FILTER & AUTH USER --------------------------- * //
        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * hanya bisa diakses oleh superadmn dan admin project saja
        is_superadmin_or_admin_pm(req, project.id_pm)
        // * --------------------------- ----------------- --------------------------- * //

        // * objek daily notes baru
        const this_day_date = new Date()
        const formatted_date = format_date(this_day_date, "yyyy-MM-dd").toString()

        // * cek apakah sudah pernah ajukan buat daily notes hari ini (untuk jaga jaga) jika sudah ada maka akan gagal
        project.daily_notes.forEach(data => {
            if(data.date.toString() === formatted_date.toString()){
                throw_err("Hari ini sudah buat daily-notes", statusCode['400_bad_request'])
            }
        })

        const new_daily_notes = new BaseDailyNotes(formatted_date)
        //* tambah terkait absen
        new_daily_notes.attendances = []
        //* tambah data worker ke daily notes
        project.workers.forEach(id_workers => {
            const data_attendance = {
                id_user : id_workers,
                attendances : false // * default value belum absen
            }
            new_daily_notes.attendances.push(data_attendance)
        })

        // * tambah data daily notes baru ke project
        project.daily_notes.push(new_daily_notes)
        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil buat daily notes baru"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.template = async (req, res, next) => {
    try{


        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil buat daily notes baru"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}