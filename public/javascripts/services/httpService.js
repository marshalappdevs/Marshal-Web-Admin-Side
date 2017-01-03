angular.module('marshalApp')
    .factory('httpService', ['$q', '$http', '$window', '$mdDialog', 'jwtHelper', '$mdMedia', function($q, $http, $window, $mdDialog, jwtHelper, $mdMedia) {
        
        // Get ApiToken and its properties
        var token = $window.localStorage.getItem('apiToken');
        var username = jwtHelper.decodeToken(token)._doc.username;

        // Showing dialog to reconnect when apiToken is expired
        var reconnect = function(url) {
            if(!url) {
                url = 'javascripts/templates/passDialog.html';
            }
            var isFullScreen = $mdMedia('sm') || $mdMedia('xs');
            return $mdDialog.show({
                controller: 'passDialogController',
                templateUrl: url,
                parent: angular.element(document.body),
                clickOutsideToClose:true,
                fullScreen: isFullScreen
            });
        };

        /**
         * This function handles all reconnection procedure
        */
        var passReconnectProc = function(url) {
            var deferredReconnect = $q.defer();
            reconnect(url).then(function(password) {
                var userData = {username: username, password: password, isLogin: false};
                
                // Get a new api token
                $http.post('/auth', userData).then(function(response) {
                    $window.localStorage.setItem('apiToken', response.data.apiToken);
                    token = response.data.apiToken;
                    deferredReconnect.resolve();
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
                    ).then(function() {deferredReconnect.reject();});
                });
            });

            return deferredReconnect.promise;
        }


        /**
         *  This function is responisble for getting a new token
         */
        var refresh = function() {
            // Creates a new promise
            var deferred = $q.defer();

            // If token is expired, a login is required
            if(jwtHelper.isTokenExpired(token)) {
                passReconnectProc().then(function() {deferred.resolve();},
                                         function() {deferred.reject();});
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
                }, function() { // Handle unverified tokens - login again
                    passReconnectProc().then(function() {deferred.resolve();},
                                             function() {deferred.reject();});
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

                // To ask for password
                passReconnectProc('javascripts/templates/passDialogDel.html').then(function() {
                    refresh().then(function() {
                    var httpPromise = $http({
                                        method: 'DELETE',
                                         url: urlToGet,
                                         data: reqData,
                                         headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                            }
                                      });
                    
                    defrredHttp.resolve(httpPromise);
                    }, function() {defrredHttp.reject();});
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
            },
            postSecure: function(urlToGet, reqData) {
                var defrredHttp = $q.defer();

                // To ask for password
                passReconnectProc('javascripts/templates/passDialogDel.html').then(function() {
                    refresh().then(function() {
                    var httpPromise = $http({
                                        method: 'POST',
                                         url: urlToGet,
                                         data: reqData,
                                         headers: {
                                            'Authorization': 'JWT ' + $window.localStorage.getItem('apiToken')
                                            }
                                      });
                    
                    defrredHttp.resolve(httpPromise);
                    }, function() {defrredHttp.reject();});
                }, function() {defrredHttp.reject();});
                
                return defrredHttp.promise;
            }
        }
        }])