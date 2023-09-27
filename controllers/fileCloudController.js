const statusCode = require('../utils/status-code').httpStatus_keyValue
const {Storage} = require('@google-cloud/storage')
const {format} = require('util')
const storage = new Storage({ keyFilename: "./mandorin-sa.json" })
const bucket = storage.bucket('mandorin-dev')

const crypto = require('crypto')
const QRCode = require('qrcode')

// * ------------------------------ FUNCTION ------------------------------ * //


function throw_err(msg, code){
    const err = new Error(msg) 
    err.statusCode = code 
    throw err
}


// * -------------------------------- CONTROLLER ------------------------------ * //

exports.upload_file = async (req, res, next) => {
    try{
        /*
        * jangan lupa ada kemungkinan dengan kondisi jika sudah ada kemudian upload lagi maka otomatis langsung replace yang sebelumnya (sebelumnya hapus kemudian tambah baru yang diupload)

        * dikerjakan baru untuk daily-notes saja dan satu daily-notes(expenses/incomes) hanya akan bisa upload 1 file saja
        */ 

        let filename
        let foldername
        let qr_code

        // * format file expenses/incomes
        // ? (date)-(expenses/incomes)-(randombytes).extension
        // * gunakan random bytes karena nanti akan gunakan sistem jika upload lagi pada hari yang sama maka akan replace dengan lakukan hapus yang sebelumnya
        if(req.type === 'daily-notes'){

            // * filter tipe file diupload
            const file_in = ['zip', 'rar', 'jpg', 'jpeg', 'png', 'pdf'] // * jika ingin jadi dinamis bisa gunakan req.file_type_allow -> misalnya untuk berikan array extensi file yang diperbolehkan
            const file_name = req.file.originalname
            const file_split = file_name.split('.') 
            const file_ext = file_split[file_split.length - 1]
            if(!file_in.includes(file_ext)){
                return {
                    errors: true,
                    message: "file extensi tidak diperbolehkan",
                    statusCode: statusCode['400_bad_request']
                }
            }
            // * misal gunakan filtering juga untuk tipe file yang dikirmkan

            foldername = 'daily-notes/'
            const random_name = crypto.randomBytes(4).toString('hex')
            // * req.daily_notes_type -> "incomes/expenses"
            filename = req.daily_notes_date.toString() + '-' + req.daily_notes_type + '-' + random_name + "." + file_ext

            if(req.file_now){ // * delete jika sebelumnya ada file
                const file_del_arr = req.file_now.split('/')
                const del_file = file_del_arr[file_del_arr.length - 1]
                const filepath_del = 'daily-notes/' + del_file
                await bucket.file(filepath_del).delete()
            }
        } else if(req.type === 'qr-daily'){

            if(req.daily_notes.length > 0){
                // * jika sudah ada hari sebelumnya, maka hapus data qr hari sebelumnya
                const file_del_arr = req.daily_notes[req.daily_notes.length - 1].qr_code_attendances.split('/')
                const file_del = file_del_arr[file_del_arr.length - 1]
                const filepath_del = "qr-attendances/" + file_del 
                await bucket.file(filepath_del).delete() 
            }

            qr_code = await QRCode.toBuffer(req.code_qr)
            filename = req.id_project + "-" + req.daily_notes_date.toString() + ".png"
            foldername = 'qr-attendances/'
        }

        const uploadpath = foldername + filename // * full filepath 

        // ! upload process 
        const blob = bucket.file(uploadpath)

        const blobStream = blob.createWriteStream({
            resumable: false
        })

        blobStream.on('error', err => { 
            return {
                errors: true,
                message: "Error saat upload",
                statusCode: statusCode['400_bad_request']
            }
        })

        let publicUrl = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        )

        blobStream.on('finish', async (data) => {

        })

        if(req.file){
            blobStream.end(req.file.buffer)
        } else {
            blobStream.end(qr_code)
        }
        

        return {
            errors: false, 
            publicUrl: publicUrl
        }

    } catch (e) {
        return {
            errors: true,
            message: "Internal server error",
            statusCode: statusCode['500_internal_server_error']
        }
    }
}





exports.download_file = async (req, res, next) => {
    try{

        let filepath = req.file_url
        let foldername
        // * do something  
        const filesplit = filepath.split('/')
        const filename = filesplit[filesplit.lenght - 1]

        if(req.type === 'daily_notes'){
            foldername = 'daily_notes/' + filename
        }

        // * -----------
        const [metaData] = await bucket.file(foldername).getMetadata()
        res.redirect(metaData.mediaLink) 

    } catch (e) {
        if(!e.statusCode){
            e.statusCode = statusCode['500_internal_server_error']
        }
        next(e)
    }
}





exports.delete_file = async (req, res, next) => {
    try{

        let filePath = req.file_url
        let foldername
        // * do something or check check check 
        
        const filesplit = filePath.split('/')
        const filename = filesplit[filesplit.length - 1]

        if(req.type === 'daily_notes'){
            foldername = 'daily-notes/' + filename
        }

        // * --------------------------------
        console.log(foldername)
        await bucket.file(foldername).delete() 

        return true

    } catch (e) {
        console.log(e)
        return false
    }
}