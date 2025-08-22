const mongoose = require('mongoose');

const storeTimezoneSchema = new mongoose.Schema({
    store_id: {
        type : String,
        required: true,
        unique: true,
        index: true
    },
    timezone_str: {
        type: String,
        required: true,
        default: 'America/Chicago'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('StoreTimezone', storeTimezoneSchema);