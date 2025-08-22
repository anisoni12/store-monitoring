const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    report_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Running', 'Complete', 'Failed'],
        default: 'Running'
    },
    csv_data: {
        type: String,   // the csv file content is stored as a string 
        default: null
    },
    created_at: {
        type: Date,
        Default: Date.now
    },
    completed_at: {
        type: Date,
        default: null
    },
    error_message: {
        type: String,
        default: null
    }
}, {
    timestamps : true
});

module.exports = mongoose.model('Report', reportSchema);