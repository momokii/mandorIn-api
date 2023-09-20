//const User = require('../models/users')
// const Role = require('../models/roles')
// const Project = require('../models/projects')
// const ProjectWorker = require('../models/project-worker')
// const { Op }  = require('sequelize')
const {validationResult} = require("express-validator");
const bcrypt = require("bcrypt");
const statusCode = require('../utils/status-code').httpStatus_keyValue
// * ganti gunakan mongoose
const User = require('../models/user');
const user = require("../models/user");

// * ------------------------------ FUNCTION ------------------------------ * //

function throw_err(msg, code){
    const err = new Error(msg)
    err.statusCode = code
    throw err
}

// * ------------------------------ CONTROLLER ------------------------------ * //

exports.get_user_self = async (req, res, next) => {
    try{
        const user =  await User.findById(req.user_id)
            .populate('id_role')
        if(!user) {
            throw_err("Token error, akun tidak ditemukan", statusCode['404_not_found'])
        }

        const response = {
            id: user._id,
            username: user.username,
            nama: user.nama,
            id_role: user.id_role._id,
            role: user.id_role.name
        }
        // * penyesuaian struktur response sesuai dengan role akun
        if(response.id_role === 2){
            response.projects = user.projects
        } else if(response.id_role === 3){
            response.id_project = user.id_project
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapat info akun",
            data: response
        })
    } catch (e) {
        if(e.statusCode){
            e.statusCpd = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_user = async (req, res, next) => {
    try{
        const username = req.params.username
        const user = await User.findOne({
             username : username
            //attributes: ['id', 'username', 'nama', 'id_role', 'role.nama']
        }).populate('id_role')
        //* tetap ada check di bawah -> karena dengan gunakan superadmin bisa akses siapa saja/masukan apa saja, jadi ada kemungkinan tidak ditemukan
        if(!user){
            throw_err('Data akun tidak ditemukan', statusCode['404_not_found'])
        }

        const response = {
            id: user._id,
            username: user.username,
            nama: user.nama,
            id_role: user.id_role._id,
            role: user.id_role.name
        }
        // * penyesuaian struktur response sesuai dengan role akun
        if(response.id_role === 2){
            response.projects = user.projects
        } else if(response.id_role === 3){
            response.id_project = user.id_project
        }

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Dapat info akun',
            data: response
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.get_all_user = async (req, res, next) => {
    try{
        // * PAGINATION CONFIGURATION
        let total_data
        let users
        const page = parseInt(req.query.page) || 1
        const size = parseInt(req.query.size) || 10
        const start_data = (page - 1) * size

        if(req.query.free === 'true'){
            // // * proyek yang sudah selesai
            // const project = await Project.findAll({
            //     where : {on_progress : false},
            //     attributes: ['id']
            // })
            // const project_done = project.map(doc => doc.id)

            // ffffffffffffffffffffffffffffff

            // * cari user yang free dengan filter user untuk mengecualikan data dari array "busy_workers" -> karena hanya cari user role 3 yang tanpa project bisa kecualikan saja
            // * dengan gunakan nosql dapat hanya dengan cara seperti di bawah
            users = await User.find({
                id_role: 3,
                id_project: null
            })
                .populate('id_role')
                .skip(start_data)
                .limit(size)
            total_data = users.length


        } else if(req.query.pm === 'true' || req.query.user === 'true'){
            let role = 3

            if(req.query.pm === 'true'){
                role = 2 // * jika yang dicari adalah pm/admin/user dengan role kode 2
            }
            // total_data = await User.count({
            //     where: {
            //         id_role: role
            //     }
            // })
            total_data = await User.countDocuments({
                id_role: role
            })
            // users = await User.findAll({
            //     include: Role,
            //     where: {
            //         id_role: role
            //     },
            //     offset: start_data,
            //     limit: size
            // })
            users = await User.find({
                id_role: role
            })
                .populate('id_role')
                .skip(start_data)
                .limit(size)


        } else {
            // * cari semua data
            total_data = await User.countDocuments()
            // users = await User.findAll({
            //     include: Role,
            //     offset: start_data,
            //     limit: size
            // })
            users = await User.find()
                .populate('id_role')
                .skip(start_data)
                .limit(size)
        }

        //const data = users
        // * karena nosql dan gunakan struktur sama pada data admin dan user -> ada penyesuaian struktur yang ditampilkan berdasarkan role-nya
        const data = users.map(data => {
            let data_return = {
                id: data._id,
                username: data.username,
                nama: data.nama,
                id_role: data.id_role._id,
                role: data.id_role.name
            }
            if(data.id_role._id === 2) {
                data_return.projects = data.projects
            } else if(data.id_role._id === 3) {
                data_return.id_project = data.id_project
            }

            return data_return
        })

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Dapatkan data akun",
            data: {
                total_data: total_data,
                page: page,
                per_page: size,
                akun : data
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.create_account = async (req, res, next) => {
    try{
        const val_err = validationResult(req)
        if(!val_err.isEmpty()){
            throw_err(val_err.array()[0].msg, statusCode['400_bad_request'])
        }

        const username = req.body.username
        const nama = req.body.nama
        const password = req.body.password
        const hash_password = await bcrypt.hash(password, 12)
        const id_role = req.body.id_role

        // await User.create({
        //     username: username,
        //     password: hash_password,
        //     nama: nama,
        //     id_role: id_role
        // })
        const new_user = new User({
                username: username,
                password: hash_password,
                nama: nama,
                id_role: id_role
        })

        await new_user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: 'Sukses Buat Akun Baru',
            data: {
                username: username
            }
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.change_password = async (req, res, next) => {
    try{
        const id = req.body.id_user
        const user = await User.findById(id) //await User.findByPk(id)
        if(!user){
            throw_err("Data akun tidak ditemukan", statusCode['400_bad_request'])
        }

        const val_err = validationResult(req)
        if(!val_err.isEmpty()){
            throw_err(val_err.array()[0].msg, statusCode['400_bad_request'])
        }

        const password = req.body.password
        const hash_password = await bcrypt.hash(password, 12)

        user.password = hash_password
        await user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Sukses ubah password akun " + user.username
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.change_info = async (req, res, next) => {
    try{
        /*
         * catatan
         * dibuat tidak bisa edit username dahulu karena jika bisa edit username -> maka akan ubah username dan token akan tidak valid karena pada token akan cek username juga
         */
        const id_user = req.body.id_user
        //const new_username = req.body.username
        const new_nama = req.body.nama

        const user = await User.findById(id_user) //User.findByPk(id_user)
        if(!user){
            throw_err("Terjadi error saat mencari informasi akun", statusCode['400_bad_request'])
        }

        const val_err = validationResult(req)
        if(!val_err.isEmpty()){
            throw_err(val_err.array()[0].msg, statusCode['400_bad_request'])
        }

        //user.username = new_username
        user.nama = new_nama
        await user.save()

        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasi edit informasi akun"
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.delete_user = async (req, res, next) => {
    try{
        const user_id = req.body.id_user
        const user =  await User.findById(user_id) //await User.findByPk(user_id)
        if(!user){
            throw_err("Terjadi error saat mencari informasi akun", statusCode['400_bad_request'])
        }
        const username = user.username

        // * -------------------------------------------------------
        // * sebelum hapus akun tentu bersihkan hal terkait seperti
        /**
         * * catatam user
         * * project terkait dll
         * * sesuaikan dengan role untuk hal beraiktan yang perlu dihapus pada tabel lain
         */

        // *! ---- CODE CODE CODE CODE CODE ---- * //

        // * -------------------------------------------------------

        //await user.destroy()
        //await User.findByIdAndRemove(user_id)

        res.status(statusCode['200_ok']).json({
            errors: false,
            message:'Berhasil hapus akun ' + username
        })

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.post_change_username = async (req, res, next) => {
    try{

        // ! --------------------- FILTER & AUTH USER -------------------- * //
        const id_user = req.body.id_user 
        const new_username = req.body.new_username 

        const user_change = await User.findById(id_user)
        if(!user_change){
            throw_err("Data akun tidak ditemukan", statusCode['404_not_found'])
        }

        const val_err = validationResult(req)
        if(!val_err.isEmpty()){
            throw_err(val_err.array()[0].msg, statusCode['400_bad_request'])
        }
        // ! ------------------- ----------------- ---------------------- * //

        user_change.username = new_username

        await user_change.save()
        
        res.status(statusCode['200_ok']).json({
            errors: false,
            message: "Berhasil ubah username user"
        })

    } catch(e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}