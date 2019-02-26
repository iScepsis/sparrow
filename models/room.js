let mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    participants: [
        {type: String, ref: 'Ingredient'}
    ],
    author: {
        type: String,
        required: true,
        ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Room = mongoose.model('Room', schema);