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
var malshabItems = require('../Database/Models/MalshabItemSchema');

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});


// Get all malshab items
router.get('/', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    malshabItems.find(function (err, malshabItems) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(malshabItems);
    });
});

// Get page
router.get('/:page', function(req, res, next) {
    // If paging was requesting, sending chronically added courses
    malshabItems.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});

// Create malshab item
router.post('/', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    malshabItems.update({url : req.body.url},
    req.body, {upsert:true}, function(err, result) {
        if(!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: 'malshab item created successfully! :)' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t create malshab item... :(' });
        }
    });
});

// Delete malshab
router.delete('/:id', function(req, res) {
    malshabItems.remove({ _id: req.params.id }, function(err, result) {
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

// Update malshab (any property)
router.put('/:id', function(req, res) {

        let shit = {imageUrl: req.body.malshabToUpdate.imageUrl,
                    order: req.body.malshabToUpdate.order,
                    title: req.body.malshabToUpdate.title,
                    url: req.body.malshabToUpdate.url};
    malshabItems.update({_id: ObjectID(req.params._id)}, shit, {upsert: true}, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.status(201);
        } else {
            console.log(err);
            res.status(400);
        }
    });
});


module.exports = router;