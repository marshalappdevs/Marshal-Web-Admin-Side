var mongoose = require('mongoose');

var malshab =  new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            url : {
                type: String,
                unique: true,
                required: true
            },
            title : {
                type: String,
                unique: true,
                required: true
            },
            imageUrl : {
                type: String,
                required: true
            },
            order : Number
});

malshab.plugin(require('mongoose-paginate'));
module.exports = mongoose.model('MalshabItems', malshab);