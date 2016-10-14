var mongoose = require('mongoose');

module.exports = {
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },  
            ID : Number,
            Name : String,
            MaximumPeople : Number,
            Description : String,
            StartDate : String,
            EndDate : String
}