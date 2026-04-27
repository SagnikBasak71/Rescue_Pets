const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    contact: {
        required: true,
        type: String
    },
    address: {
        required: true,
        type: String
    },

    // 🔔 Firebase device token
    fcmToken: {
        type: String,
        default: null
    },
    
    status: {
    type: String,
    default: "active"
}

});

// Avoid OverwriteModelError
module.exports = mongoose.models.Volunteer || mongoose.model('Volunteer', volunteerSchema);