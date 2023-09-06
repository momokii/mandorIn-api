const statusCode = require('../utils/status-code').httpStatus_keyValue
//const Role = require('../models/roles')
// * ganti ke mongoose
const Role = require('../models/role')


// * ------------------------------ CONTROLLER ------------------------------ * //

exports.get_roles = async (req, res, next) => {
    try{
        const roles = await Role.find()

        const data = roles.map(data => {
            return {
                id: data._id,
                nama: data.name
            }
        })

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapatkan data role",
            data: data
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.edit_roles_name = async (req, res, next) => {
    try{
        const id = req.body.id
        const nama_baru = req.body.nama

        updated_role = await Role.findById(id)
        updated_role.name = nama_baru
        await updated_role.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil ubah nama role"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}