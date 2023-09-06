const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roleSchema = new Schema({
    _id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Role', roleSchema)
