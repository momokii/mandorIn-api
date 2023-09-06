const mongoose = require('mongoose')
const Schema = mongoose.Schema


const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    nama: {
        type: String,
        required: true
    },
    id_role: {
        type: Number,
        required: true,
        ref: "Role"
    },
    projects: [{
        type: Schema.Types.ObjectId,
        ref: "Project"
    }],
    id_project: {
        type: Schema.Types.ObjectId,
        default: null,
        ref:"Project"
    },
    token: {
        auth: {type: String, default: null}
    }
}, {
    timestamps: true
})


// userSchema.pre("save", async function(next) {
//     if(this.id_role === 2) {
//
//     }
//     next()
// })


module.exports = mongoose.model("User", userSchema)