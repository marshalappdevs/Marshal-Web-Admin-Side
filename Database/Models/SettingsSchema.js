var mongoose = require('mongoose');

var settingsSchema = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            lastUpdateAt : String,
            minVersion : Number,
            channels: Array
});

settingsSchema.plugin(require('mongoose-paginate'));
module.exports = mongoose.model('Settings', settingsSchema);