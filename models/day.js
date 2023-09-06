const mongoose = require('mongoose')
const Schema = mongoose.Schema

const daySchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Day', daySchema)