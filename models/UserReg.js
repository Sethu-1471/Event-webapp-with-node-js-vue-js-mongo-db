const mongoose = require('mongoose');

const UserRegSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: { 
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
})

module.exports = mongoose.model('UserReg', UserRegSchema)