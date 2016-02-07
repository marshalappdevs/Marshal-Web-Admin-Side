angular.module('marshalApp')
    .service('propGetter', [PropGetter]);

function PropGetter() {
    var tempProps = 
        [
            {
                realName: 'id',
                hebName: 'מס סידורי'
            },
            {
                realName: 'name',
                hebName: 'שם הקורס'
            },
            {
                realName: 'symbol',
                hebName: 'סימול קורס'
            },
            {
                realName: 'desc',
                hebName: 'תיאור הקורס'
            },
            {
                realName: 'syl',
                hebName: 'סילבוס'
            },
            {
                realName: 'duration',
                hebName: 'אורך הקורס'
            },
            {
                realName: 'reqs',
                hebName: 'דרישות מקדימות'
            },
            {
                realName: 'destPop',
                hebName: 'אוכלוסיית יעד'
            },
            {
                realName: 'dep',
                hebName: 'מדור'
            },
            {
                realName: 'price',
                hebName: 'מחיר'
            },
            {
                realName: 'notes',
                hebName: 'הערות'
            },
        ];
        
    this.getPropNames = function() {
        return tempProps;
    }
}