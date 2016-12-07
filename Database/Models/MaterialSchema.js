var mongoose = require('mongoose');

var material =  new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            url : {
                type: String,
                unique: true,
                required: true
            },
            hashTags : String,
            title : String,
            description : String,
            baseUrl : String,
            imageUrl : String
});

material.plugin(require('mongoose-paginate'));
module.exports = mongoose.model('Materials', material);