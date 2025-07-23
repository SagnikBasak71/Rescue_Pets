const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    pet_type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    upload_date_time: {
        type: Date,
        required: true,
        default: Date.now
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Pet', petSchema);
