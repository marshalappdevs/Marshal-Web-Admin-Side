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
var multipartyMiddleware = require('connect-multiparty')();
var parser = require('json-parser');

// Loading both passport strategies
require('../config/passport')(passport);
require('../config/passportAdmin')(passport);
require('../config/passportLogin')(passport);

// Reload passport strategies
emitter.on('secretChange', function() {
    require('../config/passport')(passport);
    require('../config/passportAdmin')(passport);
});

// Courses
var courses = require('../Database/Models/CourseSchema');

// Get all courses
router.get('/', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    courses.find(function (err, courses) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        if(req.query.light) {
            var lightArr = [];
            courses.forEach(function(currCourse) {
                lightArr.push({"text": currCourse._doc.ID + " - " + currCourse._doc.Name, "id": currCourse._doc.ID});
            });
            res.json(lightArr);
        } else {
            res.json(courses);
        }
    });
});

// Get page
router.get('/:page', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res, next) {
    // If paging was requesting, sending chronically added courses
    courses.paginate({}, { page: parseInt(req.params.page), limit: 10, sort: {_id: -1}}, function(err, result) {
        if (err) { res.status(500).send(""); }
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    });
});


// Create course
router.post('/', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    var fileName = req.body.CourseCode + '.' + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
    var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
    https.get(req.body.imageUrl, function(result) {
        result.pipe(file);
        // setLastUpdateNow();
        req.body.PictureUrl = "http://marshalweb.azurewebsites.net/images/" + fileName;
        // courses.create(req.body, function(err, course) {
        //     if (err) {
        //         res.status(400).json({message: 'Couldn\'t create new course..'});
        //         console.log(err);
        //     } else {
        //         setLastUpdateNow();
        //         res.status(201).json({ message: 'Created successfuly' });
        //     }
        // });
        courses.update({ID : req.body.ID},
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

// Update courses (any property)
router.put('/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.update({ CourseCode: req.params.courseCode}, req.body, function(err, result) {
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

// // Delete courses
router.delete('/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    courses.remove({ CourseCode: req.params.courseCode }, function(err, result) {
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

router.post('/json', multipartyMiddleware, function(req, res) {
    var file = req.files.file;
    fs.readFile(file.path, 'utf-8', function(err, data) {  
    if (err) res.status(400).send(err);
    var parsedCourses;

    // Trying to parse the JSON
    try {
        parsedCourses = parser.parse(data);
    } catch (err){
        res.status(400).send("פורמט קובץ שגוי");
    }

    // Trying to find an existing course
    if(parsedCourses) { 
        courses.find({ID: parsedCourses.ID}, function(err, data) {
            if(err) console.log(err);
            if(data.length > 0) {
                courses.update({ID: parsedCourses.ID}, parsedCourses, {upsert: true}, function(err, result) {
                    setLastUpdateNow();
                    res.json("הקורס עודכן בהצלחה");
                });
            } else {
                parsedCourses.isMooc = false;
                parsedCourses.isMeetup = false;
                parsedCourses.imageUrl = null;
                parsedCourses.Ratings = [];
                courses.update({ID: parsedCourses.ID}, parsedCourses, {upsert: true}, function(err, result) {
                    setLastUpdateNow();
                    res.json("הקורס נוסף בהצלחה");
                });
            }
        })
    }
});
});

// // Images
router.get('/images/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function (req, res, next) {
    courses.findOne({ CourseCode: req.params.courseCode }, 'PictureUrl', function(err, picUrl) {
        // If there's no error
        if (!err) {
            res.sendFile('images/' + picUrl._doc.PictureUrl, { root: path.join(__dirname, '../public') });
        }
    });
});

router.post('/images/:courseCode', passport.authenticate('jwtAdmin', { session: false }), function(req, res) {
    // Checks if only url has been sent
    if (req.body.imageUrl) {
        var fileName = req.params.courseCode + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
        var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
        https.get(req.body.imageUrl, function(result) {
            result.pipe(file);
            // setLastUpdateNow();
            res.json({ error_code : 0, err_desc : null, filename : fileName });
        });
    }
});

// Add rating
router.post('/ratings/:courseObjectId', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    courses.update({_id : req.params.courseObjectId},
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
router.put('/ratings/:courseObjectId', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    courses.update({_id : req.params.courseObjectId,
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
router.delete('/ratings/:courseObjectId', passport.authenticate(['jwt', 'jwtAdmin'], { session: false }), function(req, res) {
    courses.update({_id : req.params.courseObjectId,
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