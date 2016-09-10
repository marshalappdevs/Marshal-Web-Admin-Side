module.exports = {
    "cycleList" : [ 
        require('./CycleSchema')
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
    IsMeetup : Boolean,
    "Ratings" : [ 
        require('./RatingSchema')
    ]
}