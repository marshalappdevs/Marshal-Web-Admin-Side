angular.module('marshalApp')
    .factory('httpService', ['$q', '$http', '$window', '$mdDialog', 'jwtHelper', '$mdMedia', function($q, $http, $window, $mdDialog, jwtHelper, $mdMedia) {
        
        // Get ApiToken and its properties
        var token = $window.localStorage.getItem('apiToken');
        var username = jwtHelper.decodeToken(token)._doc.username;

        // Showing dialog to reconnect when apiToken is expired
        var reconnect = function() {
            var isFullScreen = $mdMedia('sm') || $mdMedia('xs');
            return $mdDialog.show({
                controller: 'passDialogController',
                templateUrl: 'javascripts/templates/passDialog.html',
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullScreen: isFullScreen
            });
        };

        var refresh = function(password) {
            // Creates a new promise
            var deferred = $q.defer();

            // If token is expired, a login is required
            if(jwtHelper.isTokenExpired(token)) {
                reconnect().then(function(password) {
                    var userData = {username: username, password: password, isLogin: false};
                    
                    // Get a new api token
                    $http.post('/auth', userData).then(function(response) {
                        $window.localStorage.setItem('apiToken', response.data.apiToken);
                        token = response.data.apiToken;
                        deferred.resolve();
                    },
                    function(response) {
                        // Show error
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title('התחברות מחדש כשלה')
                                .textContent(response.data)
                                .ariaLabel('Failed Login')
                                .ok('אוקיי')
                        );

                        // Reject promise
                        deferred.reject();
                    });
                }, function() {});
            } else { // Normal refresh
                $http({
                    method: 'POST',
                    url: '/refresh',
                    data: {username: username},
                    headers: {
                        'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                    }
                }).then(function(response) {
                    // Setting new api token
                    $window.localStorage.setItem('apiToken', response.data.apiToken);
                    token = response.data.apiToken;
                    deferred.resolve();
                });
            }

            // Returning the promise
            return deferred.promise;
        }

        // Return an object with all http methods
        return {
            get: function(urlToGet) {
                var defrredHttp = $q.defer();
                refresh().then(function() {
                    var httpPromise = $http({
                                        method: 'GET',
                                        url: urlToGet,
                                        headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                        }
                                       });

                    defrredHttp.resolve(httpPromise);
                }, function() {defrredHttp.reject();});

                return defrredHttp.promise;
            },
            post: function(urlToGet, reqData) {
               var defrredHttp = $q.defer();
                refresh().then(function() {
                    var httpPromise =   $http({
                                        method: 'POST',
                                         url: urlToGet,
                                         data: reqData,
                                         headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                        }
                });

                    defrredHttp.resolve(httpPromise);
                }, function() {defrredHttp.reject();});

                return defrredHttp.promise;
            },
            put: function(urlToGet, reqData) {
                var defrredHttp = $q.defer();
                refresh().then(function() {
                    var httpPromise =   $http({
                                        method: 'PUT',
                                         url: urlToGet,
                                         data: reqData,
                                         headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                         }
                                    });

                    defrredHttp.resolve(httpPromise);
                }, function() {defrredHttp.reject();});

                return defrredHttp.promise;
            },
            delete: function(urlToGet, reqData) {
                var defrredHttp = $q.defer();
                refresh().then(function() {
                    var httpPromise =   $http({
                                        method: 'DELETE',
                                         url: urlToGet,
                                         data: reqData,
                                         headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                            }
                                        });

                    defrredHttp.resolve(httpPromise);
                }, function() {defrredHttp.reject();});

                return defrredHttp.promise;
            },
            update: function(urlToGet, reqData) {
                var defrredHttp = $q.defer();
                refresh().then(function() {
                    var httpPromise =   $http({
                                         method: 'UPDATE',
                                         url: urlToGet,
                                         data: reqData,
                                         headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                        }
                                         });

                    defrredHttp.resolve(httpPromise);
                }, function() {defrredHttp.reject();});

                return defrredHttp.promise;
            }
        }
        }])