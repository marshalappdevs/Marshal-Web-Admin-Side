var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
 
var courseSchema = new mongoose.Schema({
    _id : { type: mongoose.Schema.ObjectId, auto: true },
    updated_at: { type: Date, default: Date.now },
    "cycleList" : [require("./CycleSchema")],
    ID : {
        type: Number,
        unique: true,
        required: true
    },
    Name : {
        type: String,
        unique: true,
        required: true
    },
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
    GmushHours: {type: Number, default: 0},
    "Ratings" : [require("./RatingSchema")]
});

courseSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Courses', courseSchema);