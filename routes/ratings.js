'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var emitter = require('../config/emitter');
var ObjectID = require('mongodb').ObjectID;
var setLastUpdateNow = require('./utility');

var ratings = require('../Database/Models/RatingSchema');

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});


// Get all ratings
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    ratings.find(function (err, ratings) {
        if (err) return console.error(err);
        res.setHeader('Content-Type', 'application/json');
        res.json(ratings);
    });
});

// Get page
router.get('/:page', function(req, res, next) {
    // If paging was requesting, sending chronically added courses
    materials.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});

// Create rating
router.post('/', passport.authenticate('jwt', { session: false, failureRedirect: '/' }), function(req, res) {
    ratings.create(req.body, function(err, rating) {
        if (err) {
            res.json({ code: 400, message: 'Couldn\'t create new rating..'});
            console.log(err);
        } else {
            setLastUpdateNow();
            res.json({ code: 201, message: 'Created successfuly' });
        }
    });
});

// Get rating by course id
router.get('/:courseCode', passport.authenticate('jwt', { session: false }), function (req, res, next) {
    ratings.find({ courseCode: req.params.courseCode } , function(err, ratings) {
        if (err) return console.error(err);
        setLastUpdateNow();
        res.setHeader('Content-Type', 'application/json');
        res.json(ratings);
    });
});

// Delete rating
router.delete('/:courseCode/:userMailAddress',  passport.authenticate('jwt', { session: false }), function(req, res) {
    ratings.remove({ courseCode : req.params.courseCode,
        userMailAddress : req.params.userMailAddress}, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: 'Deleted rating!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t delete rating' });
        }
    });
});

// Update rating (any property)
router.put('/ratings',  passport.authenticate('jwt', { session: false }), function(req, res) {
    ratings.update({ courseCode : req.body.courseCode,
        userMailAddress : req.body.userMailAddress}, req.body, function(err, result) {
    // If everything's alright
            if (!err && result.ok === 1) {
                setLastUpdateNow();
                res.json({ code: 200});
            } else {
                res.json({error: 'something went wrong..'});
                console.log(err, result);
            }
        });
});

module.exports = router;