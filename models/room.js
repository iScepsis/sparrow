let mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    name: {
        type: String,
        required: true
    },
    users: {
        type: Array
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Room = mongoose.model('Room', schema);