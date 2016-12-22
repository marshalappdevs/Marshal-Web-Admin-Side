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
var faqItems = require('../Database/Models/FaqsSchema');

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
router.get('/', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    faqItems.find(function (err, faqItems) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(faqItems);
    });
});

// Get page
router.get('/:page', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    // If paging was requesting, sending chronically added courses
    faqItems.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});

// Update useful/unuseful
router.post('/:isUseful', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    if (req.params.isUseful === "useful") {
        faqItems.update({_id : req.body._id}, {$inc: { Useful : 1}}, function(err, result) {
            if(!err) {
                console.log(result);
                res.json({ code: 201, message: 'faq updated successfully! :)' });
            } else {
                console.log(err);
                res.json({ code: 400, message: 'Couldn\'t update the faq... :(' });
            }
        });
    } else if (req.params.isUseful === "unuseful"){
        faqItems.update({_id : req.body._id}, {$inc: { Unuseful : 1}}, function(err, result) {
            if(!err) {
                console.log(result);
                res.json({ code: 201, message: 'faq updated successfully! :)' });
            } else {
                console.log(err);
                res.json({ code: 400, message: 'Couldn\'t update the faq... :(' });
            }
        });
    }

    
});

// Create FAQ item
router.post('/', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    faqItems.create(req.body.newFaq, function(err, faq) {
        if (!err) {
            res.json({ code: 400, message: 'Couldn\'t create new FAQ..'});
            console.log(err);
        } else {
            setLastUpdateNow();
            res.json({ code: 201, message: 'Created successfuly' });
        }
    });
});

// Update FAQ item
router.put('/:id', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    faqItems.update({_id : ObjectID(req.body.FaqToUpdate._id)},
    req.body.FaqToUpdate, function(err, result) {
        if (err) {
            res.json({ code: 400, message: 'Couldn\'t update the FAQ..'});
            console.log(err);
        } else {
            setLastUpdateNow();
            res.json({ code: 201, message: 'updated successfuly' });
        }
    });
});

// Delete Faq
router.delete('/:id', function(req, res) {
    faqItems.remove({ _id: req.params.id }, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.status(201).send("V");
        } else {
            console.log(err);
            res.status(400).send(err);
        }
    });
});

module.exports = router;