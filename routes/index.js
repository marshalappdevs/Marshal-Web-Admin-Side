var express = require('express');
var router = express.Router();
var db = require('../Database/mongoObject');

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

// Data

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

module.exports = router;
