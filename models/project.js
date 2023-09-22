const mongoose = require('mongoose')
const Schema = mongoose.Schema



const projectSchema = new Schema({
    nama : {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    // * konversi nanti ke tanggal -> di mongo nanti akan punya struktur "2023-09-04T00:00:00.000+00:00"
    start_project: {
        type: String ,// *lebih mudah pakai string karena akhirnya misal pake date proses komparasi juga gunakan ke string lagi //Date, // diganti dari sebelumnya string di ubah ke Date -> tapi semua jam menit detik 0:0:0
        required: true
    },
    end_target_project: {
        type: String, // diganti dari sebelumnya string di ubah ke Date -> tapi semua jam menit detik 0:0:0
        required: true
    },
    id_day_work_start : {
        type: Number,
        required: true,
        ref: "Day"
    },
    id_day_work_last: {
        type: Number,
        required: true,
        ref: "Day"
    },
    id_workhour: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Workhour"
    },
    long: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    id_pm : {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    on_progress: {
        type: Boolean,
        default: true
    },
    on_track: {
        type: Boolean,
        default: true
    },
    workers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    daily_notes: [{
        is_extra_day: {
            type: Boolean,
            default: false
        },
        daily_attendances: {
            type: Boolean,
            //required: true,
            default: false
        },
        daily_confirmation: {
            type: Boolean,
            default: true
        },
        date: {
            type: String,
            required: true
        },
        note: String ,
        note_tomorrow: String,
        incomes: {
            data: String,
            total: {type: Number, default: 0},
            file: {type: String, default: null}
        },
        expenses: {
            data: String,
            total: {type: Number, default: 0},
            file: {type: String, default: null}
        },
        workers_notes: [{
            id_user : {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            data: String
        }],
        attendances: [{
            id_user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            attendances: {
                type: Boolean,
                default: false
            },
            attendances_time: {
                type: String,
                default: null
            }
        }]
    }]
}, {
    timestamps: true
})

module.exports = mongoose.model("Project", projectSchema)