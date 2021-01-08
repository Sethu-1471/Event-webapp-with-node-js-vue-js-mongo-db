const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

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
    },
    myRegistration: [{
        type: ObjectId,
        ref: "Event"
    }]
})

module.exports = mongoose.model('UserReg', UserRegSchema)