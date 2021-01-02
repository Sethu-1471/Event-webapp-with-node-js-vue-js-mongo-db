const mongoose = require('mongoose');

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
})

module.exports = mongoose.model('Event', EventSchema)