var mongoose = require('mongoose');
var request = require('request');
var config = require('../../config/main');

var faqSchema = new mongoose.Schema({
            _id : { type: mongoose.Schema.ObjectId, auto: true },
            updated_at: { type: Date, default: Date.now },  
            Question : {
                type: String,
                unique: true,
                required: true
            },
            Answer : String,
            Address : String,
            Latitiude : Number,
            Longitude : Number,
            PhoneNumber : String,
            Link : String,
            ImageUrl : String,
            PinToTop : Boolean,
            Useful : Number,
            Unuseful : Number 
});

// If there is an Address, Get LatLang and attach to the Object using Google GeoCoder API
faqSchema.pre('save', function(next){
    if(this.Address && (this.isModified('Address') || this.isNew)) {
        var faqInstance = this;
        var API_KEY = config.serverApiKey;
        var BASE_URL = "https://maps.googleapis.com/maps/api/geocode/json?address=";

        var address = encodeURI(faqInstance.Address.replace(/\s/g, "+"));

        var url = BASE_URL + address + "&key=" + API_KEY;

        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var bodyJson = JSON.parse(body);
                if (bodyJson.results && bodyJson.results.length > 0) {
                    var location = bodyJson.results[0].geometry.location;
                    faqInstance.Latitiude = location.lat;
                    faqInstance.Longitude = location.lng;
                }
            }
            next();
        });   
    }
    else
    {
        return next();
    }
});

faqSchema.plugin(require('mongoose-paginate'));
module.exports = mongoose.model('faq', faqSchema);