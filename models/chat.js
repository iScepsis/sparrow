let mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

let schema = new Schema({
    namespace: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Chat = mongoose.model('Chat', schema);