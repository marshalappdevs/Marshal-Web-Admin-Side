var mongoose = require('mongoose');

var material =  new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            url : String,
            hashTags : String,
            title : String,
            description : String,
            baseUrl : String,
            imageUrl : String
});

module.exports = mongoose.model('Materials', material);