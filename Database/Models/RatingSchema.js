var mongoose = require('mongoose');

var ratings = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            userMailAddress : String,
            rating : Number,
            comment : String,
            createdAt : String,
            lastModified : String
})

ratings.plugin(require('mongoose-paginate'));
module.exports = ratings;