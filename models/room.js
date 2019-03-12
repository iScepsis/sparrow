let mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    participants: [
        {type: String, ref: 'User'}
    ],
    author: {
        type: String,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    },
    is_active: {
        type: Boolean,
        default: true
    }
});

exports.Room = mongoose.model('Room', schema);