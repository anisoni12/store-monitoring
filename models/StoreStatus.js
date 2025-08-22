const mongoose = require('mongoose');

const storeStatusSchema = new mongoose.Schema({
    store_id: {
        type: String,
        required: true,
        index: true
    },
    timestamp_utc: {
        type: Date,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['active' , 'inactive'],
        required: true
    }
}, {
    timestamps: true
});

storeStatusSchema.index({store_id: 1, timestamp_utc: 1});
module.exports = mongoose.model('StoreStatus', storeStatusSchema);