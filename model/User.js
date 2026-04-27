const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    location: {   // ✅ ADDED (you were using it)
        type: String,
        required: true
    }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);