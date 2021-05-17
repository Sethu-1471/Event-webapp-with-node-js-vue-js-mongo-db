const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    desc: {
        type: String
    },
    tags: {
        type: [Object]
    },
    start: {
        type: String,
        required: true
    },
    end: {
        type: String
    },
    registration: {
        type: Boolean,
        default: true
    },
    image: { 
        type: String,
        required: true
    },
    createdBy: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    modelink: String,
    public: {
        type: Boolean,
        required: true,
        default: true
    },
    mode: {
        type: Boolean,
        required: true,
        default: true
    },
    participants: [{
        user: {
            type: ObjectId,
            ref: "UserReg"
        },
        time: {
            type: Date,
            default: Date.now()
        }
    }],
    userSaved: [{
        user: {
            type: ObjectId,
            ref: "UserReg"
        },
        time: {
            type: Date,
            default: Date.now()
        }
    }],
    certificate: {
    type: Boolean,
    default: false
    },
    feedback: [{
        name: String,
        feedback: String
    }]
})

module.exports = mongoose.model('Event', EventSchema)