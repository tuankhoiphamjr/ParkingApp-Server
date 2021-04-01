const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    filename: {
        required: true,
        type: String,
    },
    fileId: {
        required: true,
        type: String,
    },
    type:{
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});

module.exports = mongoose.model('Image', ImageSchema);