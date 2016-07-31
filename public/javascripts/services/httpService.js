angular.module('marshalApp')
    .factory('httpService', ['$q', '$http', '$window', function($q, $http, $window) {
        return {
            get: function(urlToGet) {
               return $http({
                    method: 'GET',
                    url: urlToGet,
                    headers: {
                        'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                    }
                });
            },
            post: function(urlToGet) {
               return $http({
                    method: 'POST',
                    url: urlToGet,
                    headers: {
                        'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                    }
                });
            },
            put: function(urlToGet) {
               return $http({
                    method: 'PUT',
                    url: urlToGet,
                    headers: {
                        'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                    }
                });
            },
            delete: function(urlToGet) {
               return $http({
                    method: 'DELETE',
                    url: urlToGet,
                    headers: {
                        'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                    }
                });
            },
            update: function(urlToGet) {
               return $http({
                    method: 'UPDATE',
                    url: urlToGet,
                    headers: {
                        'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                    }
                });
            }
        }
        }])