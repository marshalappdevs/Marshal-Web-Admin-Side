var mongoose = require('mongoose');

var malshab =  new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            url : String,
            title : String,
            imageUrl : String
});

module.exports = mongoose.model('MalshabItems', malshab);