var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
 
var courseSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.ObjectId, auto: true },
    updated_at: { type: Date, default: Date.now },
    "cycleList" : [ 
        {type: mongoose.Schema, ref: 'Cycles'}
    ],
    ID : Number,
    Name : String,
    CourseCode : String,
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
    IsMooc : Boolean,
    "Ratings" : [ 
        {type: mongoose.Schema, ref: 'Ratings'}
    ]
});

courseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Courses', courseSchema);