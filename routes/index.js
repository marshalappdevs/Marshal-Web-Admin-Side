var express = require('express');
var router = express.Router();
var db = require('../Database/mongoObject');
var upload = require('../image_upload/image-upload');

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

// API

router.get('/api/courses', function(req, res, next) {
    //var courses = db.model('Courses', )
    db
    .then(function (courses) {
        courses.find(function (err, courses) {
            if (err) return console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.json(courses);
        });
    });
});

router.post('/api/images', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code : 1, err_desc : err});
            return;
        }
        res.json({ error_code : 0, err_desc : null});
    });
});

module.exports = router;
