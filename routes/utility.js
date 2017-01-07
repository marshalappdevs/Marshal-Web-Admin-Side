var mongoose = require('mongoose');
var settings = require('../Database/Models/SettingsSchema');

module.exports = function (){
    var time = new Date().getTime();
    settings.findOne({ isSettingsDocument: true}, function(err, doc) {
        if(err == null) {
            doc.lastUpdateAt = '/Date(' + time + ')/';
            doc.updated_at = Date.now();
            doc.save();
        }
    });
};
