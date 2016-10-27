'use strict';

var router = require('express').Router();
var upload = require('../image_upload/image-upload');
var path = require('path');
var https = require('https');
var fs = require('fs');
var mongoose = require('mongoose');
var passport  = require('passport');
var jwt = require('jsonwebtoken');
var config = require('../config/main');
var emitter = require('../config/emitter');
var setLastUpdateNow = require('./utility');

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});

// meetups
var meetups = require('../Database/Models/MeetupSchema');

// Get all meetups
router.get('/', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    meetups.find(function (err, meetups) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        if(req.query.light) {
            var lightArr = [];
            meetups.forEach(function(currCourse) {
                lightArr.push({"text": currCourse._doc.meetupCode + " - " + currCourse._doc.Name, "id": currCourse._doc.meetupCode});
            });
            res.json(lightArr);
        } else {
            res.json(meetups);
        }
    });
});

// Get page
router.get('/:page', passport.authenticate('jwt', { session: false }), function(req, res, next) {
    // If paging was requesting, sending chronically added meetups
    meetups.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});


// Create course
router.post('/', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    var fileName = req.body.meetupCode + '.' + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
    var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
    https.get(req.body.imageUrl, function(result) {
        result.pipe(file);
        // setLastUpdateNow();
        req.body.PictureUrl = "http://marshalweb.azurewebsites.net/images/" + fileName;
        // meetups.create(req.body, function(err, course) {
        //     if (err) {
        //         res.status(400).json({message: 'Couldn\'t create new course..'});
        //         console.log(err);
        //     } else {
        //         setLastUpdateNow();
        //         res.status(201).json({ message: 'Created successfuly' });
        //     }
        // });
        meetups.update({ID : req.body.ID},
         req.body, {upsert:true}, function(err, result) {
             if(!err) {
                 console.log(result);
                 setLastUpdateNow();
                 res.status(201).json({ message: 'Created successfuly' });
             } else {
                 console.log(err);
                 res.status(400).json({message: 'Couldn\'t create new course..'});
             }
         });
        // res.json({ error_code : 0, err_desc : null, filename : fileName });
    });
});

// Update meetups (any property)
router.put('/:meetupCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    meetups.update({ meetupCode: req.params.meetupCode}, req.body, function(err, result) {
            // If everything's alright
        if (!err && result.ok === 1) {
            setLastUpdateNow();
            res.json({ code: 200});
        } else {
            res.json({code:400, error: 'something went wrong..'});
            console.log(err, result);
        }
    });
});

// // Delete meetups
router.delete('/:meetupCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    meetups.remove({ meetupCode: req.params.meetupCode }, function(err, result) {
        if (!err) {
            console.log(result);
            setLastUpdateNow();
            res.json({ code: 201, message: 'Deleted course!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t delete course' });
        }
    });
});

// // Images
router.get('/images/:meetupCode', passport.authenticate('jwtAdmin', { session: false }), function (req, res, next) {
    meetups.findOne({ meetupCode: req.params.meetupCode }, 'PictureUrl', function(err, picUrl) {
        // If there's no error
        if (!err) {
            res.sendFile('images/' + picUrl._doc.PictureUrl, { root: path.join(__dirname, '../public') });
        }
    });
});

router.post('/images/:meetupCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    // Checks if only url has been sent
    if (req.body.imageUrl) {
        var fileName = req.params.meetupCode + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
        var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
        https.get(req.body.imageUrl, function(result) {
            result.pipe(file);
            // setLastUpdateNow();
            res.json({ error_code : 0, err_desc : null, filename : fileName });
        });
    }
});

// Add rating
router.post('//ratings/:courseObjectId', passport.authenticate('jwt', { session: false }), function(req, res) {
    meetups.update({_id : req.params.courseObjectId},
                    {$addToSet : {Ratings : req.body}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'rating added successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t add rating' });
        }
    });
});

// Update rating
router.put('/ratings/:courseObjectId', passport.authenticate('jwt', { session: false }), function(req, res) {
    meetups.update({_id : req.params.courseObjectId,
        'Ratings.userMailAddress' : req.body.userMailAddress},
                    {$set : {'Ratings.$.rating' : req.body.rating,
                'Ratings.$.comment' : req.body.comment,
                'Ratings.$.lastModified' : req.body.lastModified}}, function(err, numAffected) {
        if (!err) {
            console.log(numAffected);
            res.json({ code: 201, message: 'rating updated successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t update rating' });
        }
    });
});

// Remove rating
router.delete('/ratings/:courseObjectId', passport.authenticate('jwt', { session: false }), function(req, res) {
    meetups.update({_id : req.params.courseObjectId,
        'Ratings.userMailAddress' : req.body.userMailAddress},
                    {$pull : {Ratings : {userMailAddress : req.body.userMailAddress}}}, function(err, result) {
        if (!err) {
            console.log(result);
            res.json({ code: 201, message: 'rating removed successfully!' });
        } else {
            console.log(err);
            res.json({ code: 400, message: 'Couldn\'t remove rating' });
        }
    });
});

module.exports = router;