const mongoose = require('mongoose');

var Itin = mongoose.model('Itin', {
    userId: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    city: {
        type: String,
        default: 'Los Angeles'
    },
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        default: 'Draft'
    },
    places: {
        type: [],
        default: []
    },
    inProgress: {
        type: Boolean,
        default: true
    }
})

module.exports = {
    Itin
}