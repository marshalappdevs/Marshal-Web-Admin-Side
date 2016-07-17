angular.module('marshalApp')
    .factory('httpService', ['$q', '$http', function($q, $http) {
        return {
            printCon: function() { console.log('yo');}
        }
    }])