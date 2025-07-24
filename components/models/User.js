const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional, depending on your auth
    // Add other fields as needed
}, {
    timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
