const mongoose = require('mongoose')
const Schema = mongoose.Schema

// * tidak gunakan date -> karena hanya akan update per hari saja
// * akan di create -> ketika buat object baru & diupdate (sesuai GET dari api pada hari tersebut ketika project buat daily notes baru)
const weatherSchema = new Schema({
    id_project : {
        type: Schema.Types.ObjectId,
        Ref: "Project",
        required: true
    },
    timezone: {
        type: String,
        default: null
    },
    elevation: {
        type: Number,
        default: null
    },
    unit: {
        temperature: {type: String, default:"°C" },
        precipitation: {type: String, default: "%"}
    },
    date: {
        type: String,
        default: null
    },
    hourly: [],
    temp_forecast: [],
    precipitation_probability: []
})

module.exports = mongoose.model("Weather", weatherSchema)