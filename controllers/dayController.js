const statusCode = require('../utils/status-code').httpStatus_keyValue
// * ganti ke mongo
const Day = require('../models/day')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(code, msg) {
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ CONTROLLER ------------------------------ * //

exports.get_days = async (req, res, next) => {
    try{
        const days = await Day.find()

        const data = days.map(data => {
            return {
                id: data._id,
                nama: data.name
            }
        })

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Dapatkan data day (hari)',
            data: data
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}