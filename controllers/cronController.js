require('dotenv')
const statusCode = require('../utils/status-code').httpStatus_keyValue
const cron_func = require('../utils/cron-function')
const cron = require('node-cron')
const CronModels = require('../models/cron')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * -------------------------------- CRON FUNC ------------------------------ * //

let cron_task // * use to stop the cron func

async function cronFunc(interval){
    return cron.schedule(interval, async () => {

        let cron_data = await CronModels.findOne({})
        const cron_status = cron_data.status

        if(cron_status){
            await cron_func.update_daily_notes_projects_cron_func()
        } else {
            console.log('cron status off')
        }
        
    })
}

async function startCronFunction() {
    try{
        let cron_data = await CronModels.findOne({})
        const cron_interval = cron_data.interval
        const cron_schedule = `*/${cron_interval} * * * *`
        console.log(cron_schedule)

        cron_task = await cronFunc(cron_schedule)

    } catch(e){
        console.log(e)
    }
}
startCronFunction()


// * -------------------------------- CONTROLLER ------------------------------ * //

exports.get_cron_data = async (req, res, next) => {
    try{
        const cron_data = await CronModels.findOne({})
        const data = {
            cron_id: cron_data._id,
            cron_status: cron_data.status,
            cron_interval_minute: cron_data.interval
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Get cron data",
            data: data
        })

    } catch(e){
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.update_change_cron_interval = async (req, res, next) => {
    try{
        // * notes
        // * change interval cron function ( in minute interval )

        // ! ---------------------- FILTER ---------------------- * //
        const new_interval = req.body.new_interval
        if(!new_interval){
            throw_err('Interval not inputted', statusCode['400_bad_request'])
        }

        if(new_interval < 1 || new_interval > 60){
            throw_err('Interval must be between 1 - 60', statusCode['400_bad_request'])
        }
        // ! ---------------------- ------ ---------------------- * //

        const cron_data = await CronModels.findOne({})
        cron_data.interval = new_interval

        await cron_data.save()

        cron_task.stop()

        startCronFunction() // * start new cron scheduler

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Success change cron interval"
        })

    } catch(e){
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.cron_switch_on_off = async (req, res, next) => {
    try{
        const cron_data = await CronModels.findOne({})
        const cron_status = cron_data.status

        if(cron_status){
            cron_data.status = false
        } else {
            cron_data.status = true
        }

        const new_status = cron_data.status

        await cron_data.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: `Success change status cron to ${new_status}`
        })

    } catch(e){
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}