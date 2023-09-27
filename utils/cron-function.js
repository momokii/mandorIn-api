require('dotenv')
const BaseDailyNotes = require('../models/daily-notes-struct')
const date_formatter = require('date-fns')
const {update_weather_daily} = require('../utils/update-weather-daily')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const file_controller = require('../controllers/fileCloudController')

const Project = require('../models/project')

// * ------------------------------ FUNCTION ------------------------------ * //

function today_date_str(){
    /*
        * return string date hari ini dengan format
        * yyyy-MM-dd
        * ex : 2023-09-28
        * zona : WIB
     */
    const date = new Date() // * secara otomatis jika diformat akan langsung berubah ke dalam waktu WIB/ sesuai dengan waktu dilokal
    const formatted_date = date_formatter.format(date, "yyyy-MM-dd").toString()
    return formatted_date
}

const post_daily_notes_cron = async (id_project) => {

    const session = await mongoose.startSession()
    session.startTransaction()

    try{

        // ! --------------------- FILTER --------------------- * //
        const project = await Project.findById(id_project)
        if(!project) throw new Error('Project tidak ditemukan')

        const today_str_date = today_date_str()
        

        for(let note of project.daily_notes){
            if(note.date.toString() === today_str_date){
                throw new Error("Hari ini sudah buat daily-notes")
            }
        }

        // ! --------------------- ------ --------------------- * //
        // * konfirmasi untuk set hari sebelumnya konfirmasi hari dan absensi
        if(project.daily_notes.length > 0){
            const last_day_daily_notes = project.daily_notes[project.daily_notes.length - 1]
            last_day_daily_notes.daily_attendances = true 
            last_day_daily_notes.daily_confirmation = true
        }

        // * jika hari ini sudah > target project
        const end_target_project_date = new Date(project.end_target_project)
        const date_today = new Date(today_str_date)
        if(date_today > end_target_project_date){
            project.on_track = false
        }

        const new_daily_notes = new BaseDailyNotes(today_str_date)

        new_daily_notes.attendances = []
        for(let id_worker of project.workers){
            const data_attendance = {
                id_user : id_worker,
                attendances : false
            }
            new_daily_notes.attendances.push(data_attendance)
        }
        

        // * weather data api update
        const weather = await update_weather_daily(project)
        if(!weather.status){
            throw new Error('Update weather failed')
        }

        const code_qr = jwt.sign({
            id_project: id_project,
            date: today_str_date
        }, process.env.JWT_SECRET)

        let req = {
            code_qr: code_qr,
            type: 'qr-daily',
            id_project: id_project,
            daily_notes: project.daily_notes,
            daily_notes_date : today_str_date
        }
        const post_qr_code = await file_controller.upload_file(req) 
        if(post_qr_code.errors === true){
            console.log("Buat Daily Code gagal")
            await session.abortTransaction()
        }

        new_daily_notes.qr_code_attendances = post_qr_code.publicUrl

        if(project.daily_notes.length > 0){
            project.daily_notes[project.daily_notes.length - 1].qr_code_attendances = null
        }

        project.daily_notes.push(new_daily_notes)

        // * save data
        await project.save({session})
        await weather.data.save({session})
        

        // * commit transaction and end session
        await session.commitTransaction()
        session.endSession()

        return true

    } catch (e){
        await session.abortTransaction()
        console.log(e.message)
        return false
    }
}


exports.update_daily_notes_projects_cron_func = async () => {
    try{

        const projects = await Project.find() 
        const today_day_code = (new Date()).getDay()

        for(let project of projects){
            if(project.on_progress){
                const project_day_start_work = project.id_day_work_start
                const project_day_last_work = project.id_day_work_last

                // * post daily-notes jika hari aktif
                if((today_day_code >= project_day_start_work) && (today_day_code <= project_day_last_work)){
                    const create_daily_notes = await post_daily_notes_cron(project._id.toString())

                    if(create_daily_notes){
                        console.log("berhasil buat untuk project " + project._id.toString())
                    }
                }
                else {
                    console.log('project sedang libur ' + project._id.toString())
                }
            }
        }

    } catch(e){
        console.log(e)
    }
}


