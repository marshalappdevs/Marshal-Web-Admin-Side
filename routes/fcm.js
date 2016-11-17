'use strict';

var express = require('express');
var router = express.Router();
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var FCMLib = require('fcm-node');
var emitter = require('../config/emitter');

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});


var fcm = new FCMLib(config.serverApi);
var registrations =require('../Database/Models/FcmRegistrationSchema');
var settings = require('../Database/Models/SettingsSchema');

router.get('/channels/', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    settings.findOne(function (err, settings) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(settings._doc.channels);
    });
});

router.post('/register',  passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    registrations.update({hardwareId : req.body.hardwareId},
        req.body, {upsert:true}, function(err, result) {
            if(!err) {
                console.log(result);
                res.json({ code: 201, message: 'registered successfully! :)' });
            } else {
                console.log(err);
                res.json({ code: 400, message: 'Couldn\'t register... :(' });
            }
        });
});

// Update registration (tokenId only) ////////////////////
router.put('/register',  passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    registrations.update({hardwareId : req.body.hardwareId}, req.body, function(err, result) {
        // If everything's alright
        if (!err && result.ok === 1) {
            res.json({ code: 200});
        } else {
            res.json({error: 'something went wrong..'});
            console.log(err, result);
        }
    });
});

// Delete registration ////////////////////////////////
router.delete('/unregister/:hardwareId',  passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    registrations.remove({hardwareId : req.params.hardwareId}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'UnRegistered!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t unregister' });
        }
    });
});

// Add channel
router.post('/channels/:hardwareId/:channel', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$addToSet : {channels : req.params.channel}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'channel added successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t add channel' });
        }
    });
});

// Remove channel
router.delete('/channels/:hardwareId/:channel', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$pull : {channels : req.params.channel}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'channel removed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t remove channel' });
        }
    });
});


// Add course subscription
router.post('/subscription/course/:hardwareId/:course_id', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$addToSet : {courses : req.params.course_id}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'Subscribed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t subscribe' });
        }
    });
});

// Remove course subscription
router.delete('/subscription/course/:hardwareId/:course_id', function(req, res) {
    registrations.update({hardwareId : req.params.hardwareId},
                    {$pull : {courses : req.params.course_id}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'Unsubscribed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t unsubscribe' });
        }
    });
});

// Get registration
router.get('/registrations/:hardwareId', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    registrations.findOne({hardwareId : req.params.hardwareId},function (err, registration) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(registration);
    });
});

////////////// Send Push ///////////////////////////
function sendPush(registrations, dataObject) {

    // Add the registration tokens of the devices you want to send to
    var registrationIds = [];
    registrations.forEach(function(registration){
        registrationIds.push(registration.registrationTokenId);
    });

    var message = {
        registration_ids: registrationIds, 
        data: dataObject
    };

    fcm.send(message, function(err, response){
        if (err) {
            res.status(400).send("Something went wrong..")
        } else {
            res.status(200).send("V");
        }
    });
}

router.post('/sendpush/', function(req, res) {
    if (req.body.channels != undefined && req.body.channels.length > 0
             && req.body.courses != undefined && req.body.courses.length > 0) {
        registrations.find({$or: [{channels: { $in : req.body.channels}},
                        {courses: { $in : req.body.courses}}]},'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    } else if ((req.body.channels == undefined || req.body.channels.length == 0) 
                    && (req.body.courses != undefined && req.body.courses.length > 0)) {
        registrations.find({courses: { $in : req.body.courses}}
                    ,'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    } else if ((req.body.courses == undefined || req.body.courses.length == 0) 
                    && (req.body.channels != undefined && req.body.channels.length > 0)) {
        registrations.find({channels: { $in : req.body.channels}}
                    ,'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    } else {
        registrations.find({},'registrationTokenId',function (err, registrations) {
            if (err) {
                console.error(err);
                res.json({ code: 400, message: err });
            }
            else if (registrations.length > 0) {
                res.json({ code: 201, message: registrations });
                sendPush(registrations, req.body.data);
            } else {
                console.log('No GCM Registrations');
                res.json({ code: 201, message: "No GCM Registrations" });
            }
        });
    }
});

module.exports = router;