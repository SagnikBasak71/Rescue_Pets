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
        default: 'pending'
    },

    image: {
        type: String,
        required: true
    },

    // 🔥 LOCATION (MAP)
    latitude: {
        type: Number,
        required: true
    },

    longitude: {
        type: Number,
        required: true
    },

    // 🔥 WHO UPLOADED
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    // 🔥 NEW: TRACK WHO REJECTED
    rejectedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
}

});

// 🔥 OPTIONAL INDEX (FOR FUTURE OPTIMIZATION)
petSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Pet', petSchema);