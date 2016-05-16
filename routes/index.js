var express = require('express');
var router = express.Router();
var db = require('../Database/mongoObject');
var dbMaterials = require('../Database/mongoObjectMaterials');
var dbRatings = require('../Database/mongoObjectRatings');
var dbGcmRegisterations = require('../Database/mongoObjectGcmRegisteration');
var dbGeneral = require('../Database/mongoObjectGeneral');
var upload = require('../image_upload/image-upload');
var path = require('path');
var https = require('https');
var fs = require('fs');
var gcm = require('node-gcm');

// Layouts

router.get('/', function(req, res, next) {
  res.render('layout', { title: 'Marshal' });
});

// Pages

router.get('/index', function(req, res, next) {
    res.render('pages/index');
});

// Modals

router.get('/courseModal', function(req, res, next) {
    res.render('modals/courseModal');
});

router.get('/addCourseModal', function(req, res, next) {
    res.render('modals/addCourseModal');
});

// Directives

router.get('/courseField', function(req, res, next) {
    res.render('directives/courseField');
});

router.get('/imageUploadField', function(req, res, next) {
    res.render('directives/imageUploadField');
});

// API

// Courses

// Get all courses
router.get('/api/courses', function(req, res, next) {
    db
    .then(function (courses) {
        courses.find(function (err, courses) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(courses);
        });
    });
});

// Create course
router.post('/api/courses', function(req, res) {
    db
    .then(function(courses) {
        courses.create(req.body, function(err, course) {
            if (err) {
                res.json({ code: 400, message: "Couldn't create new course.."});
                console.log(err);
            } else {
                res.json({ code: 201, message: "Created successfuly" });
            }
        });
    });
});

// Update courses (any property)
router.put('/api/courses', function(req, res) {
    db
    .then(function (courses) {
        courses.update({ ID: req.body.ID}, req.body, function(err, result) {
            // If everything's alright
            if (!err && result.ok === 1) {
                res.json({ code: 200});
            } else {
                res.json({error: "something went wrong.."});
                console.log(err, result);
            }
        });
    });
});

// Delete courses
router.delete('/api/courses/:courseId', function(req, res) {
    db
    .then(function(courses) {
        courses.remove({ ID: req.params.courseId }, function(err, result) {
            if (!err) {
                console.log(result);
                res.json({ code: 201, message: "Deleted course!" });
            } else {
                console.log(err);
                res.json({ code: 400, message: "Couldn't delete course" })
            }
        });
    });
});

// Images

router.get('/api/images/:courseId', function (req, res, next) {
    db
    .then(function (courses) {
        courses.findOne({ CourseCode: req.params.courseId }, 'PictureUrl', function(err, picUrl) {
            // If there's no error
            if (!err) {
                res.sendFile('images/' + picUrl._doc.PictureUrl, { root: path.join(__dirname, '../public') });
            }
        })
    });
});

router.post('/api/images', function(req, res) {
    // Checks if only url has been sent
    if (req.body.imageUrl) {
        var datetimestamp = Date.now();
        var fileName = "file-" + datetimestamp + "." + req.body.imageUrl.split('.')[req.body.imageUrl.split('.').length - 1];
        var file = fs.createWriteStream(path.join(__dirname, '../public/images/') + fileName);
        https.get(req.body.imageUrl, function(result) {
            result.pipe(file);
            res.json({ error_code : 0, err_desc : null, filename : fileName });
        });
    } else {
        // If not only url, then the user want to upload from his local disk
        upload(req, res, function(err) {
            if (err) {
                res.json({ error_code : 1, err_desc : err });
                return;
            }
            res.json({ error_code : 0, err_desc : null, filename : req.file.filename });
        });
    }
});

/////////////////////////////// IDO //////////////////////////////

//////////////////////materials///////////////////////
// Get all materials 
router.get('/api/materials/', function(req, res, next) {
    dbMaterials
    .then(function (materials) {
        materials.find(function (err, materials) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(materials);
        });
    });
});
//////////////////////////////////////////////////////
/////////////////////ratings//////////////////////////
// Get all ratings 
router.get('/api/ratings/', function(req, res, next) {
    dbRatings
    .then(function (ratings) {
        ratings.find(function (err, ratings) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(ratings);
        });
    });
});
//////////////////////////////////////////////////////
// Create rating
router.post('/api/ratings', function(req, res) {
    dbRatings
    .then(function(ratings) {
        ratings.create(req.body, function(err, rating) {
            if (err) {
                res.json({ code: 400, message: "Couldn't create new course.."});
                console.log(err);
            } else {
                res.json({ code: 201, message: "Created successfuly" });
            }
        });
    });
});
//////////////////////////////////////////////////
// Get rating by course id
router.get('/api/ratings/:courseId', function (req, res, next) {
    dbRatings
    .then(function (ratings) {
        ratings.find({ courseId: req.params.courseId } , function(err, ratings) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(ratings);
        })
    });
});
/////////////////////////////////////////////////

// Delete rating
router.delete('/api/ratings/:courseCode/:userMailAddress', function(req, res) {
    dbRatings
    .then(function(ratings) {
        ratings.remove({ courseCode : req.params.courseCode, 
            userMailAddress : req.params.userMailAddress}, function(err, result) {
            if (!err) {
                console.log(result);
                res.json({ code: 201, message: "Deleted rating!" });
            } else {
                console.log(err);
                res.json({ code: 400, message: "Couldn't delete rating" })
            }
        });
    });
});

// Update rating (any property)
router.put('/api/ratings', function(req, res) {
    dbRatings
    .then(function (ratings) {
        ratings.update({ courseCode : req.body.courseCode, 
                userMailAddress : req.body.userMailAddress}, req.body, function(err, result) {
            // If everything's alright
            if (!err && result.ok === 1) {
                res.json({ code: 200});
            } else {
                res.json({error: "something went wrong.."});
                console.log(err, result);
            }
        });
    });
});

//////////////////////////////////////////////////////////
///////////////////////////// GCM ////////////////////////
//////////////////////////////////////////////////////////
////////////////// Registerations ////////////////////////
// Create new Registeration //////////////////////////////
router.post('/api/gcm/register', function(req, res) {
    dbGcmRegisterations
    .then(function(registerations) {
        registerations.create(req.body, function(err, registeration) {
            if (err) {
                res.json({ code: 400, message: "Couldn't create new registeration.."});
                console.log(err);
            } else {
                res.json({ code: 201, message: "Created successfuly" });
            }
        });
    });
});

// Update registeration (tokenId only) ////////////////////
router.put('/api/gcm/update', function(req, res) {
    dbGcmRegisterations
    .then(function (registerations) {
        registerations.update({hardwareId : req.body.hardwareId}, req.body, function(err, result) {
            // If everything's alright
            if (!err && result.ok === 1) {
                res.json({ code: 200});
            } else {
                res.json({error: "something went wrong.."});
                console.log(err, result);
            }
        });
    });
});

// Delete registeration ////////////////////////////////
router.delete('/api/gcm/unregister/:hardwareId', function(req, res) {
    dbGcmRegisterations
    .then(function(registerations) {
        registerations.remove({hardwareId : req.params.hardwareId}, function(err, result) {
            if (!err) {
                console.log(result);
                res.json({ code: 201, message: "UnRegistered!" });
            } else {
                console.log(err);
                res.json({ code: 400, message: "Couldn't unregister" })
            }
        });
    });
});

/////////////// Send Push ///////////////////////////
router.post('/api/gcm/sendPush/:messageContent', function(req, res) {
    dbGcmRegisterations
    .then(function(registerations) {
        registerations.find(function (err, registerations) {
            if (err) 
                return console.error(err);
            else if (registerations.length > 0) {
                    // Set up the sender with marshaldevs@gmail.com API key 
                var sender = new gcm.Sender('AIzaSyBUN6SZxrx-u-N0-j7BqGwOPgDP8VBuYRs');
                
                // Initialize Message object
                var message = new gcm.Message();
                message.addData('content', req.params.messageContent);
                
                // Add the registration tokens of the devices you want to send to 
                var registrationTokens = [];
                registerations.forEach(function(registeration){
                    registrationTokens.push(registeration.registerationTokenId);
                });
                
                // Send the message 
                // ... trying only once 
                sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
                    if(err) console.error(err);
                    else {
                        console.log(response);
                        res.json(response);
                    }   
                });
            } else
                console.log("No GCM Registerations");
        });
    });
});
module.exports = router;