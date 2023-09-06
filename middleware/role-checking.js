const statusCode = require('../utils/status-code').httpStatus_keyValue

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}


exports.is_superadmin = async (req, res, next) => {
    try{
        if(req.role !== 1){
            throw_err('Akun tidak punya akses', statusCode['401_unauthorized'])
        }

        next()
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.is_admin = async (req, res, next) => {
    try{
        if(req.role !== 2){
            throw_err('Akun tidak punya akses', statusCode['401_unauthorized'])
        }

        next()
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.is_user = async (req, res, next) => {
    try{
        if(req.role !== 3){
            throw_err('Akun tidak punya akses', statusCode['401_unauthorized'])
        }

        next()
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}



exports.is_itself = async (req, res, next) => {
    /**
     * * Lakukan cek dengan
     * * Ketika user BUKAN superadmin maka yang bisa lihat detail akun sendiri adalah dirinya sendiri
     */
    try{
        if(req.role !== 1 && req.username !== req.params.username){
            throw_err('Akun tidak punya akses', statusCode['401_unauthorized'])
        }

        next()
    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}