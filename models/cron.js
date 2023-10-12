const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cronSchema = new Schema({
    interval: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean
    },
})

module.exports = mongoose.model("Cron", cronSchema)