var mongoose = require('mongoose');

var faq = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },  
            Question : String,
            Answer : String,
            ImageUrl : String,
            Order : Number,
            Useful : Number,
            Unuseful : Number 
});

faq.plugin(require('mongoose-paginate'));
module.exports = mongoose.model('faq', faq);