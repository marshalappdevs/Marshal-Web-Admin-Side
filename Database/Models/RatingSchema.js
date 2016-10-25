var mongoose = require('mongoose');

var ratings = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            userMailAddress : String,
            plainMailAddress : String,
            // courseCode : String,
            rating : Number,
            comment : String,
            createdAt : String,
            lastModified : String
})

module.exports = mongoose.model('Ratings', ratings);