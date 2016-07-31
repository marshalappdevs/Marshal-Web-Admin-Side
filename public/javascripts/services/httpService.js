angular.module('marshalApp')
    .factory('httpService', ['$q', '$http', function($q, $http) {
        return {
            get: function(urlToGet) {
               return $http({
                    method: 'GET',
                    headers: {
                        'Authorization': $window.localStorage.getItem('apiToken')
                    }
                });
            }}
        }
    }])