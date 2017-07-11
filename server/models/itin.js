const mongoose = require('mongoose');

var Itin = mongoose.model('Itin', {
    userId: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
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