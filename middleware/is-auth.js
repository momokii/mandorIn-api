const jwt = require('jsonwebtoken')
//const User = require('../models/users')
const statusCode = require('../utils/status-code').httpStatus_keyValue
// * ganti gunakan mongoose
const User = require('../models/user')

module.exports = async (req, res, next) => {
    try{
        function err(msg, code){
            const err = new Error(msg)
            err.statusCode = code
            throw err
        }

        const authHeader = req.get('Authorization')
        if(!authHeader){
            err('Needed Bearer Authorization Header', statusCode['401_unauthorized'])
        }

        const token = authHeader.split(' ')[1]

        const decode_token = jwt.verify(token, process.env.JWT_SECRET)
        if(!decode_token){
            err('Token Tidak Valid', statusCode['401_unauthorized'])
        }

        const user = await User.findById(decode_token.user_id)
        if(!user){
            err('Token Tidak Valid sini', statusCode['401_unauthorized'])
        }

        if(decode_token.auth !== user.token.auth || decode_token.username !== user.username){
            err('Token Tidak Valid', statusCode['401_unauthorized'])
        }

        req.user_id = decode_token.user_id
        req.username = user.username
        req.role = user.id_role
        next()

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}