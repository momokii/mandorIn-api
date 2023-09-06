const DailyNotes = require('../models/daily-notes')

const statusCode = require('../utils/status-code').httpStatus_keyValue

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code) {
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ CONTROLLER ------------------------------ * //

// * dn -> daily notes
// * get all daily notes -> ambil semua data daily notes sampai hari -n dari sebuah project
exports.get_all_dn_project = async (req, res, next) => {
    try{


        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'msg'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_one_dn = async (req, res, next) => {
    try{


        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'msg'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}