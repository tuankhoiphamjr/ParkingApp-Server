const mongoose = require('mongoose');

const AvatarSchema = new mongoose.Schema({
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});

module.exports = mongoose.model('AvatarImage', AvatarSchema);