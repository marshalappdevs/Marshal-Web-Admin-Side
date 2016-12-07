var mongoose = require('mongoose');

var cycles = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },  
            ID : {
                type: Number,
                unique: true,
                required: true
            },
            Name : String,
            MaximumPeople : Number,
            Description : String,
            StartDate : String,
            EndDate : String
});

cycles.plugin(require('mongoose-paginate'));
module.exports = cycles;