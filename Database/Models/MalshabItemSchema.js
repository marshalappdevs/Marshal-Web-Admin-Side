var mongoose = require('mongoose');

module.exports = {
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            url : String,
            title : String,
            imageUrl : String
}