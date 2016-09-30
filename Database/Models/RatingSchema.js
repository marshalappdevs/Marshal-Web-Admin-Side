var mongoose = require('mongoose');

module.exports = {
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            userMailAddress : String,
            plainMailAddress : String,
            // courseCode : String,
            rating : Number,
            comment : String,
            createdAt : String,
            lastModified : String
}