angular.module('marshalApp')
    .service('propGetter', [PropGetter]);

function PropGetter() {
    var tempProps = 
        [
            {
                realName: 'ID',
                hebName: 'מס סידורי'
            },
            {
                realName: 'Name',
                hebName: 'שם הקורס'
            },
            {
                realName: 'CourseCode',
                hebName: 'סימול קורס'
            },
            {
                realName: 'Description',
                hebName: 'תיאור הקורס'
            },
            {
                realName: 'Syllabus',
                hebName: 'סילבוס'
            },
            {
                realName: 'DurationInDays',
                hebName: 'אורך הקורס (ימים)'
            },
            {
                realName: 'TargetPopulation',
                hebName: 'אוכלוסיית יעד'
            },
            {
                realName: 'ProfessionalDomain',
                hebName: 'מדור'
            },
            {
                realName: 'Price',
                hebName: 'מחיר'
            },
            {
                realName: 'Comments',
                hebName: 'הערות'
            },
        ];
        
    this.getPropNames = function() {
        return tempProps;
    }
}