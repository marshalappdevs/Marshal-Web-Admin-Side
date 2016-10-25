var mongoose = require('mongoose');

var fcm = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },
            registrationTokenId : String,
            hardwareId : String,
            lastModified : String,
            channels : [String],
            courses : [String]
});

module.exports = mongoose.model('FcmRegistrations', fcm);