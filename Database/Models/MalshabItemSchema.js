var mongoose = require('mongoose');

var malshab =  new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            url : String,
            title : String,
            imageUrl : String,
            order : Number,
            test : String
});

malshab.plugin(require('mongoose-paginate'));
module.exports = mongoose.model('MalshabItems', malshab);