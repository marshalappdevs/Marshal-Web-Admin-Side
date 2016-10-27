var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
 
var meetups = new mongoose.Schema({
    _id : { type: mongoose.Schema.ObjectId, auto: true },
    updated_at: { type: Date, default: Date.now },
    "cycleList" : [ 
        {type: mongoose.Schema.ObjectId, ref: 'Cycles'}
    ],
    ID : Number,
    Name : String,
    meetupCode : String,
    Description : String,
    TargetPopulation : String,
    ProfessionalDomain : String,
    Syllabus : String,
    DayTime : String,
    DurationInHours : Number,
    DurationInDays : Number,
    PassingGrade : Number,
    Price : Number,
    PictureUrl: String,
    MinimumPeople : Number,
    MaximumPeople : Number,
    Comments : String,
    Category : String,
    "Ratings" : [ 
        {type: mongoose.Schema.ObjectId, ref: 'Ratings'}
    ]
});

meetups.plugin(mongoosePaginate);
module.exports = mongoose.model('Meetups', meetups);