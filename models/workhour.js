const mongoose = require('mongoose')
const Schema = mongoose.Schema


const workhourSchema = new Schema({
    jam_masuk : {
        type: String,
        required: true
    },
    jam_selesai: {
        type: String,
        required: true
    },
    jam_istirahat_mulai : {
        type: String,
        required: true
    },
    jam_istirahat_selesai: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Workhour', workhourSchema)