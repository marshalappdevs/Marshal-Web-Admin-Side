'use strict';

var express = require('express');
var router = express.Router();
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var emitter = require('../config/emitter');
var URLCheck = require('../config/urlCheck');
var ObjectID = require('mongodb').ObjectID;
var setLastUpdateNow = require('./utility');
var faqItems = require('../Database/Models/FaqSchema');

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});


// Get all faq items
router.get('/'), function(req, res, next) {
    faqItems.find(function (err, faqItems) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(faqItems);
    });
});

// Get page
router.get('/:page', function(req, res, next) {
    // If paging was requesting, sending chronically added courses
    faqItems.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});

// Create malshab item
// router.post('/', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
//     faqItems.update({url : req.body.url},
//     req.body, {upsert:true}, function(err, result) {
//         if(!err) {
//             console.log(result);
//             setLastUpdateNow();
//             res.json({ code: 201, message: 'malshab item created successfully! :)' });
//         } else {
//             console.log(err);
//             res.json({ code: 400, message: 'Couldn\'t create malshab item... :(' });
//         }
//     });
// });

module.exports = router;