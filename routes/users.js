const router = require('express').Router()
//const User = require('../models/users')
const {body} = require('express-validator')
const statusCode = require('../utils/status-code').httpStatus_keyValue
const userController = require('../controllers/userControllers')

const is_auth = require("../middleware/is-auth");
const is_superadmin = require('../middleware/role-checking').is_superadmin
const is_itself = require('../middleware/role-checking').is_itself
// * ganti dengan mongoose
const User = require('../models/user')

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ ROUTING ------------------------------ * //

router.get('/self', is_auth, userController.get_user_self)

router.get('/:username', is_auth, is_itself, userController.get_user)

router.get('/', is_auth, is_superadmin, userController.get_all_user)



router.post('/', is_auth , is_superadmin, [
    body('username', 'Username sudah digunakan, coba yang lain')
        .isAlphanumeric()
        .custom((value, {req}) => {
            return (async () => {
                const user = await User.findOne({
                    username : value
                })
                if(user){
                    throw_err('Username sudah digunakan, coba yang lain', statusCode['400_bad_request'])
                }
            })()
        }),
    // * misal gunakan password dan konfirmasi password
    // * filter sama tidaknya dilakukan didepan
    body('password', 'Password minimal sepanjang 6 karakter dengan mengandung 1 huruf kapital dan angka')
        .isStrongPassword({
            minLength: 6,
            minNumbers: 1,
            minLowercase: 0,
            minSymbols: 0,
            minUppercase: 1
        })
], userController.create_account)



router.patch('/', is_auth, is_itself,
    // [body('username')
    //     .isAlphanumeric()
    //     .custom((value, {req}) => {
    //         return (async () => {
    //             const user = await User.findOne({
    //                 username : value
    //             })
    //             if(user && user.id !== req.body.id_user){
    //                 throw_err('Username sudah digunakan, coba yang lain', statusCode['400_bad_request'])
    //             }
    //         })()
    //     })],
    userController.change_info)



router.patch('/password', is_auth, is_itself, [
    // * misal gunakan password dan konfirmasi password
    // * filter sama tidaknya dilakukan didepan
    body('password', 'Password minimal sepanjang 6 karakter dengan mengandung 1 huruf kapital dan angka')
        .isStrongPassword({
            minLength: 6,
            minNumbers: 1,
            minLowercase: 0,
            minSymbols: 0,
            minUppercase: 1
        })
], userController.change_password)



router.delete('/', is_auth, is_superadmin, userController.delete_user)



module.exports = router