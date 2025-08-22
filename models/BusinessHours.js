const mongoose = require('mongoose');

const businessHoursSchema = new mongoose.Schema({
    store_id: {
        type: String,
        required: true,
        index: true
    },
    day_of_week: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    start_time_local: {
        type: String,
        required: true 
    },
    end_time_local: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

businessHoursSchema.index({store_id: 1, day_of_week: 1});

module.exports = mongoose.model('BusinessHours', businessHoursSchema);                                                              