const statusCode = require('../utils/status-code').httpStatus_keyValue
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
//const User = require('../models/users')
// * gunakan mongoose
const User = require('../models/user')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ CONTROLLER ------------------------------ * //

exports.login = async (req, res, next) => {
    try {

        const username = req.body.username
        const password = req.body.password

        const user = await User.findOne({
            username: username
        })
        if(!user){
            throw_err('Username / Password Salah, username', statusCode['400_bad_request'])
        }

        const check_password = await bcrypt.compare(password, user.password)
        if(!check_password){
            throw_err('Username / Password Salah', statusCode['400_bad_request'])
        }

        //* Auth Token
        const auth_token = crypto.randomBytes(16).toString('hex')
        const jwt_token = jwt.sign({
            user_id: user.id,
            username: user.username,
            auth: auth_token
        }, process.env.JWT_SECRET)

        user.token.auth = auth_token
        await user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Success Login',
            data: {
                username: username,
                token_type: 'Bearer',
                token: jwt_token
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.logout = async (req, res, next) => {
    try {
        const user = await User.findById(req.user_id)
        if(!user){
            throw_err('Token Error', statusCode['400_bad_request'])
        }

        user.token.auth = null
        await user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Success Logout'
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}