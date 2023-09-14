const statusCode = require('../utils/status-code').httpStatus_keyValue
const format_date = require('date-fns/format')
const BaseDailyNotes = require('../models/daily-notes-struct')

// * gunakan mongoose
const Project = require('../models/project')
const Workhour = require('../models/workhour')
const Day = require('../models/day')
const User = require('../models/user')
const Weather = require('../models/weather')
const axios = require("axios");


// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}


function is_superadmin_or_admin_pm(req, pm_id) {
    if(req.role !== 1 && (req.user_id.toString() !== pm_id.toString())) {
        throw_err("Akun tidak punya akses", statusCode['404_not_found'])
    }
}


// * fungsi untuk filtering -> ketika daily confirmation = true -> maka data pada hari tersebut sudah tidak bisa di edit lagi
function is_daily_confirmation_true(project){
    let daily_notes = project.daily_notes

    let today_date = today_date_str()

    for(note of daily_notes){
        if( note.date.toString() === today_date.toString() ){
            if(note.daily_confirmation === true){
                return res.status(statusCode['200_ok']).json({
                    errors: false,
                    message: "Data harian sudah dikunci, edit tidak bisa dilakukan"
                })
            }
        }
    }
}

// * fungsi filtering -> jika absnsi harian sudah dikonfirmasi
function is_attendances_confirmation_true(daily_note){
    if(daily_note.daily_attendances){
        return res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Absensi harian sudah dikonfirmasi, user tidak bisa lakukan absensi"
        })
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


function today_date_str(){
    /*
        * akan return string date hari ini dengan format
        * yyyy-MM-dd
        * ex : 2023-09-28
     */
    const date = new Date()
    const formatted_date = format_date(date, "yyyy-MM-dd").toString()
    return formatted_date
}



// * -------------------------------- CONTROLLER ------------------------------ * //




// ! -------------------------------- ---------- ------------------------------ * //
// * -------------------------------- --GET-- ------------------------------ * //
// ! ------------------------------------------- ------------------------------ * //

exports.get_workers_daily_notes_summary = async (req, res, next) => {
    try{
        /*
            * mendapatkan data absensi dan notes untuk tiap daily_notes dari satu user workers
            * ketika tidak inputkan id_project pada uqery get maka akan coba get data dari project aktif sekarang
            * ketika id_project query ada -> maka dapatkan dari data project terkait (bisa get data history projct yang pernah terlibat)
         */

        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        // * pengecekan gunakan project berdasarkan id_project atau project yang sekarang sedang dikerjakan

        const user = await User.findById(req.user_id)
        let project_id = user.id_project
        if(req.query.id_project){
            project_id = req.query.id_project
        }

        if(project_id === null){
            // * ketika misal tidak gunakan query id project dan user sedang tidak aktif pada project manapun
            throw_err("User sedang tidak aktif pada sebuah project", statusCode['400_bad_request'])
        }

        const project = await Project.findById(project_id)
            .populate({
                path : 'id_pm'
            })
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * cek kembali misal user masukan id_project pada query -> cek pada project apakah memang user terlibat pada project terkait
        if(req.query.id_project){
            const check_user = project.workers.includes(user._id)
            if(!check_user){
                throw_err("User tidak terlibat dalam project terkait", statusCode['400_bad_request'])
            }
        }

        // * get daily notes to variabel
        let daily_notes = project.daily_notes

        // ? filter from_date & to_date
        if(req.query.from_date || req.query.to_date){
            let start_index = 0
            let end_index = daily_notes.length

            if(req.query.from_date){
                start_index = daily_notes.findIndex(data => data.date.toString() === req.query.from_date.toString())
                if(start_index === -1){
                    throw_err("Tanggal from date error/ tidak ditemukan", statusCode['404_not_found'])
                }
            }

            if(req.query.to_date){
                end_index = daily_notes.findIndex(data => data.date.toString() === req.query.to_date)
                if(end_index === -1){
                    throw_err("Tanggal to date error/ tidak ditemukan", statusCode['404_not_found'])
                }
            }

            if(start_index > end_index){
                throw_err("from_date lebih besar dari to_date", statusCode['400_bad_request'])
            }

            daily_notes = daily_notes.slice(start_index, end_index + 1)
        }

        // ! --------------------------- ----------------- --------------------------- * //

        const total_data = daily_notes.length
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const start_data = (page - 1) * size

        daily_notes = daily_notes.slice(start_data, start_data + size)

        // * restruktur daily_notes data
        let user_data = []
        daily_notes.forEach(note => {
            const date = note.date
            const worker_notes = note.workers_notes
            let worker_note = null
            if(worker_notes.length > 0){ // * jika kosong maka tidak usah dicek
                for(note_worker of worker_notes){
                    if(note_worker.id_user.toString() === user._id.toString()){
                        worker_note = note_worker.data
                        break
                    }
                }
            }

            for(attendance of note.attendances){
                if(attendance.id_user.toString() === user._id.toString()){
                    const user_attendance_data = {
                        date: date,
                        id_user: attendance.id_user.toString(),
                        attendances: attendance.attendances,
                        worker_note: worker_note
                    }
                    user_data.push(user_attendance_data)
                    break
                }
            }
        })

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapatkan data absensi worker",
            data: {
                project_summary: {
                    id_project: project._id,
                    nama: project.nama,
                    description: project.description,
                    pm: {
                        id_pm : project.id_pm._id,
                        nama: project.id_pm.nama
                    }
                },
                user_daily_notes: {
                    total_data: total_data,
                    page: page,
                    per_page: size,
                    data: user_data
                }
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_daily_notes_finance_summary = async (req, res, next) => {
    try{
        /*
            * catatan beberapa yang bisa diset
            * --
            * dapatkan summary semua hari (V)
            * dapatkan summary dihari tertentu (?) -> sebenearnya juga busa gunakan langsung dari get daily notes saja (tidak bisa pilih 1 hari? atau nanti bisa gunakan gunakan daily-notes saja)
            * dapatkan summary dari hari x - x + n -> data hari bisa dibatasi untuk pemilihannya dengan nanti di FE dengan hanya bisa pilih dari tanggal tersedia dari smua daily nots yang ada di project terkait (V)
         */
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const id_project = req.query.id_project
        const project = await Project.findById(id_project)
            //.lean()
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        is_superadmin_or_admin_pm(req, req.user_id.toString())

        // ! --------------------------- ----------------- --------------------------- * //

        // * get seluruh data keuangan dan ada data
        let daily_notes = project.daily_notes
        let all_incomes_expenses = []
        let total_incomes = 0
        let total_expenses = 0
        let total = 0
        let start_date = daily_notes[0].date
        let end_date = daily_notes[daily_notes.length - 1].date
        // * jika gunakan filtering date
        let index_start = 0
        let index_end = daily_notes.length
        if(req.query.from_date || req.query.to_date){
            if(req.query.from_date){
                index_start = daily_notes.findIndex(data => data.date === req.query.from_date)
                if(index_start === -1) {
                    throw_err("Tanggal from date error/ tidak ditemukan", statusCode['400_bad_request'])
                }
            }

            if(req.query.to_date){
                index_end = daily_notes.findIndex(data => data.date === req.query.to_date)
                    if(index_end === -1){
                        throw_err("Tanggal to date error/ tidak ditemukan", statusCode['400_bad_request'])

                }
            }

            daily_notes = daily_notes.slice(index_start, index_end + 1)
        }
        // * --------------------------

        for (note of daily_notes){
            const daily_data = {
                date : note.date,
                incomes : {
                    data: note.incomes.data,
                    total: note.incomes.total
                },
                expenses : {
                    data: note.expenses.data,
                    total: note.expenses.total
                }
            }
            all_incomes_expenses.push(daily_data)
            total_incomes = total_incomes + note.incomes.total
            total_expenses = total_expenses + note.expenses.total
        }

        total = total_incomes - total_expenses

        const data = {
            start_date: start_date,
            end_date: end_date,
            daily_data: all_incomes_expenses,
            total_incomes: total_incomes,
            total_expenses: total_expenses,
            total : total
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapatkan data keuangan",
            data: data
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_daily_notes = async (req, res, next) => {
    /*
     * catatan daily notes
     * Karena langsung berikan semua data mengenai daily notes ketika get Data dari sini, maka misal butuhkan data absensi misalnya -> bisa langsung saja dapatkan dari get disini
     ! bisa berikan misal get berdasarkan tanggal, namun ketika get berdasarkan tanggal maka tidak ada data weather -> bisa digunakan misal ingin get data absensi semua/hal berkaitan pada hari tertentu saja bisa lewat sini karena sudah ada semua datanya
     *
     * dengan prioritas urutan TODAY > DATE > PAGINATION
     */
    try{
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const id_project = req.query.id_project
        const project = await Project.findById(id_project).lean()
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        //console.log(req.user_id.toString(), project.id_pm.toString())
        is_superadmin_or_admin_pm(req, project.id_pm.toString())

        // ! --------------------------- ----------------- --------------------------- * //

        let response = {
            errors: false,
            message: "Dapatkan data daily notes"
        }

        // * get hanya data hari ini
        if(req.query.today === 'true') {
            const today_str = today_date_str()
            let daily_note
            for (data of project.daily_notes) {
                if (today_str.toString() === data.date) {
                    daily_note = data
                    break
                }
            }
            response.data = daily_note

            // * get data tomorrow_note dari hari kemarin (daily-notes hari sebelumnya)
            let today_notes_from_yesterday
            const yesterday_index = (project.daily_notes.findIndex(data => data.date.toString() === today_str.toString())) - 1
            console.log(yesterday_index)
            if(yesterday_index === -1){ // * jika sekarang hari ke 1 -> maka tidak ada kemarin
                today_notes_from_yesterday = null
            } else {
                today_notes_from_yesterday = project.daily_notes[yesterday_index].note_tomorrow
            }
            console.log(today_notes_from_yesterday)
            response.data.today_note_from_yesterday = today_notes_from_yesterday

            // * untuk sekarang -> baru inputkan data weather terbaur ketika get ONE data projct
            const weather = await Weather.findOne({
                id_project: project._id.toString()
            }).lean()
            let summary = []
            for (i = 0; i < weather.hourly.length; i++) {
                const data = [weather.hourly[i], weather.temp_forecast[i], weather.precipitation_probability[i]]
                summary.push(data)
            }

            weather.summary = summary
            response.weather_prediction = weather

        // * get data pada hari tertentu saja
        } else if(req.query.date){

            let daily_note
            const date_search = req.query.date //* akan diharapkan sudah format "2023-09-10"
            for(note of project.daily_notes){
                if(date_search === note.date){
                    daily_note = note
                    break
                }
            }
            if(!daily_note){
                throw_err("Data tidak ditemukan", statusCode['404_not_found'])
            }

            response.data = daily_note

        }
        // * get semua data -> pagination
        else {
            let daily_notes = project.daily_notes

            // * get data dengan tanggal/ range tertentu
            if(req.query.from_date || req.query.to_date){
                let index_start = 0
                let index_end = project.daily_notes.length
                if(req.query.from_date){
                    index_start = project.daily_notes.findIndex(data => data.date.toString() === req.query.from_date)
                    if(index_start === -1){
                        throw_err("Tanggal from date error/ tidak ditemukan", statusCode['400_bad_request'])
                    }
                }
                if(req.query.to_date){
                    index_end = project.daily_notes.findIndex(data => data.date.toString() === req.query.to_date)
                    if(index_end === -1){
                        throw_err("Tanggal to date error/ tidak ditemukan", statusCode['400_bad_request'])
                    }
                }

                daily_notes = project.daily_notes.slice(index_start, index_end + 1)
            }

            // * set pagination
            const page = parseInt(req.query.page) || 1
            const size = parseInt(req.query.size) || 10
            const start_data = (page - 1) * size
            const total_data = daily_notes.length

            daily_notes = daily_notes.slice(start_data, start_data + size)
            response.data = {
                total_data : total_data,
                page: page,
                per_page: size,
                daily_notes: daily_notes
            }
        }

        res.status(statusCode['200_ok']).json(response)
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





// ! -------------------------------- ---------- ------------------------------ * //
// * -------------------------------- --POST-- ------------------------------ * //
// ! ------------------------------------------- ------------------------------ * //

exports.workers_delete_post_notes = async (req, res, next) => {
    try{
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const workers = await User.findById(req.user_id)
        if(!workers){
            throw_err("Token Error, Akun tidak ditemukan", statusCode['404_not_found'])
        }

        const id_project = req.body.id_project
        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")

        // * jika konfirmasi harian sudah true tidak bisa post
        is_daily_confirmation_true(project)

        let user_id_project = workers.id_project
        if(user_id_project === null){
            user_id_project = ''
        }
        if(user_id_project.toString() !== project._id.toString()){
            throw_err("User tidak terlibat dalam project terkait", statusCode['401_unauthorized'])
        }
        // ! --------------------------- ----------------- --------------------------- * //

        const today_date = today_date_str()
        const daily_notes = project.daily_notes
        for (note of daily_notes){
            if(note.date.toString() === today_date.toString()){
                // * hapus data dari array workers note
                note.workers_notes = note.workers_notes.filter(data => {
                    if(data.id_user.toString() !== workers._id.toString()){
                        return data
                    }
                })
                break
            }
        }

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil hapus data daily-notes user"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}




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
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")

        // * jika konfirmasi harian sudah true tidak bisa post
        is_daily_confirmation_true(project)

        // * cek user terlibat dalam project terkait atau tidak
        let project_id = workers.id_project
        if(project_id === null){
            project_id = ""
        }
        if(project_id.toString() !== project._id.toString()) {
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
                    // * buat baru ketika belum buat catatan pada hari tersebut
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





exports.post_notes_tomorrow = async (req, res, next) => {
    try{
        const id_project = req.body.id_project
        const data_note = req.body.data
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        const user = await User.findById(req.user_id)
        if(!user){
            throw_err("Token error, akun tidak ditemukan", statusCode['404_not_found'])
        }

        // * untuk sekarang -> hanya bisa diisi oleh superadmin dan admin projct terkait
        is_superadmin_or_admin_pm(req, project.id_pm)

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")

        // * jika konfirmasi harian sudah true tidak bisa post
        is_daily_confirmation_true(project)
        // ! --------------------------- ----------------- --------------------------- * //

        const date = new Date()
        const formatted_date = format_date(date, "yyyy-MM-dd")

        for(note of project.daily_notes){
            if(note.date.toString() === formatted_date.toString()){
                note.note_tomorrow = data_note
                break
            }
        }

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil ubah data note untuk hari besok"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.daily_attendances_confirmation = async (req, res, next) => {
    try{
        const id_project = req.body.id_project
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        is_superadmin_or_admin_pm(req, project.id_pm)

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")

        // * jika konfirmasi harian sudah true tidak bisa post
        is_daily_confirmation_true(project)
        // ! --------------------------- ----------------- --------------------------- * //

        const date_formatted = today_date_str()

        for(note of project.daily_notes){
            if(note.date.toString() === date_formatted.toString()){
                if(req.role === 2){
                    if(note.daily_attendances === true){
                        throw_err("Sudah dilakukan konfirmasi harian, Project Manager hanya bisa melakukan konfirmasi harian", statusCode['401_unauthorized'])
                    }
                    note.daily_attendances = true
                } else {
                    if(note.daily_attendances === false){
                        throw_err("SuperAdmin hanya bisa membatalkan konfirmasi absensi", statusCode['401_unauthorized'])
                    }
                    note.daily_attendances = false
                }
                break
            }
        }

        await project.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil Update Konfirmasi absen harian"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.post_attendance_workers = async (req, res, next) => {
    try{
        const id_project = req.body.id_project
        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        const user = await User.findById(req.user_id)
        if(!user){
            throw_err("Token Error, akun tidak ditemukan", statusCode['404_not_found'])
        }

        // * cek jika user bukan anggota project
        let user_project_id = user.id_project // * ada kemungkinan NULL maka tidak bisa toString()
        if(user_project_id === null){
            user_project_id = ""
        }
        if(user_project_id.toString() !== project._id.toString()){
            throw_err("User tidak terlibat dalam project terkait", statusCode['401_unauthorized'])
        }

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")

        // * jika konfirmasi harian sudah true tidak bisa post
        is_daily_confirmation_true(project)

        // * jika sudah tutup absensi harian
        is_attendances_confirmation_true()
        // ! --------------------------- ----------------- --------------------------- * //

        const formatted_date = today_date_str()
        let is_attended
        for(note of project.daily_notes){
            if(formatted_date.toString() === note.date.toString()){
                // ! checking daily confirmation attendances
                is_attendances_confirmation_true(note)

                for(worker of note.attendances){
                    if(worker.id_user.toString() === user._id.toString()){
                        if(worker.attendances === true){
                            is_attended = true
                        }
                        // ! catatan -> belum atur bisa set waktu -> belum jadi buat ssuai dengan lokal time
                        // worker.attendances_time = (new Date()).toLocaleString('en-US', 'Asia/Jakarta')
                        //console.log(worker.attendances_time)
                        worker.attendances = true
                        break
                    }
                }
                break
            }
        }

        if(is_attended){
            res.status(statusCode['200_ok']).json({
                errors: false,
                message: "User sudah absen hari ini"
            })
        } else {
            await project.save() //* save project -> karena data absen terkait ada di project bukan user

            res.status(statusCode['200_ok']).json({
                errors: false,
                message: "User {username} berhasil absen untuk hari {tanggal} - {waktu}"
            })
        }
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

        const project = await Project.findById(req.body.id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * cek jika bukan superadmin dan juga bukan admin dari project terkait
        is_superadmin_or_admin_pm(req, project.id_pm.toString())

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa jalankan proses")
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

        // * kalau project sudah DONE maka tidak bisa post
        is_project_done(project, "Project sudah selesai, tidak bisa post finance data")

        // ! filter tambahan--> cek daily confirmation sudah TRUE belum
        is_daily_confirmation_true(project)
        // ! --------------------------- ----------------- --------------------------- * //

        const today_date = new Date()
        const formatted_date = format_date(today_date, "yyyy-MM-dd")

        // * get day now -> dengan iterasi ke semua daily notes terkait
        project.daily_notes.forEach(data => {
            if(data.date.toString() == formatted_date.toString()){

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

        // ! --------------------------- FILTER & AUTH USER --------------------------- * //
        const project = await Project.findById(id_project)
        if(!project){
            throw_err("Data tidak ditemukan", statusCode['404_not_found'])
        }

        // * hanya bisa diakses oleh superadmn dan admin project saja
        is_superadmin_or_admin_pm(req, project.id_pm)

        // * kalau project sudah DONE maka tidak usah buat daily nots namun tidak error
        is_project_done(project, "Project sudah selesai, tidak bisa buat daily notes baru")

        // * jika konfirmasi harian sudah true tidak bisa post
        is_daily_confirmation_true(project)

        const this_day_date = new Date()
        const formatted_date = format_date(this_day_date, "yyyy-MM-dd").toString()

        // * cek apakah sudah pernah ajukan buat daily notes hari ini (untuk jaga jaga) jika sudah ada maka akan gagal
        project.daily_notes.forEach(data => {
            if(data.date.toString() === formatted_date.toString()){
                throw_err("Hari ini sudah buat daily-notes", statusCode['400_bad_request'])
            }
        })

        // ! --------------------------- ----------------- --------------------------- * //

        // * objek daily notes baru
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

        // ? ---------------------- update Daily Weather Prediction ----------------------

        const weather = await Weather.findOne({
            id_project : project._id.toString()
        })

        const LONG = project.long
        const LAT = project.lat
        const api_url = "https://api.open-meteo.com/v1/forecast?latitude=" + LONG.toString() +  "&longitude=" + LAT.toString() + "&hourly=temperature_2m,precipitation_probability&timezone=Asia%2FBangkok&forecast_days=1"
        const response = await axios.get(api_url)
        const response_data = response.data // response asli

        // * format untuk dapatkan date dari response api
        let date_forecast = response_data.hourly.time[0]
        const indexT = date_forecast.indexOf("T")

        // * tidak perlu format, tetap berikan number (untuk prep dan temperature) dan diformat di FE saja
        const hourly_str = response_data.hourly.time.map(data => {
            const index_T = data.indexOf("T")
            return data.substring(index_T + 1)
        })

        // * format response get data ke model weather
        weather.timezone = response_data.timezone // * sesuaikan sendiri
        weather.elevation = response_data.elevation // * berapa mdpl long lat terkait
        weather.temp_forecast = response_data.hourly.temperature_2m // * data asli 1 hari
        weather.precipitation_probability = response_data.hourly.precipitation_probability
        weather.hourly = hourly_str
        weather.date = date_forecast.substring(0, indexT)

        // ? ------------------------------------------------------------------------------

        // * tambah data daily notes baru ke project
        project.daily_notes.push(new_daily_notes)
        //await weather.save()
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





