(function(){
    'use strict';

    angular.module('ws.user')
        .factory('Auth', function ($rootScope, $http, $q, $timeout, $sailsPromised, $ionicHistory, UserSession, UserService, USER_ROLES) {
            var authService = {};

            authService.login = function (credentials) {
                //TODO: Implement Login Authenticate
                var deferred = $q.defer();
                $sailsPromised.get('/users', {email: credentials.email}).then(function(users){
                    if(users.length === 0) {
                        deferred.reject({message: 'No User found...'});
                    }else {
                        var user = users[0];
                        UserSession.create(user);
                        deferred.resolve(user);
                    }
                }, function(error){
                    deferred.reject(error);
                })

                deferred.promise.then(function(user){
                    $rootScope.$broadcast('ws.user.login', user);
                });

                return deferred.promise;
            };

            authService.register = function(credentials) {
                var deferred = $q.defer();
                UserService.newUser(user).then(function(){
                    authService.login({email: credentials.email, password: credentials.password}).then(function(user){
                        deferred.resolve(user);
                    }, deferred.reject);
                }, deferred.reject);
                return deferred.promise;                
            };

            authService.logout = function(){
                $ionicHistory.clearCache();
                var result = UserSession.destroy()
                $rootScope.$broadcast('ws.user.logout');
                return result;
            };

            authService.isAuthenticated = function () {
                return !!UserSession.getUser().username;
            };

            authService.isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                  authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() && authorizedRoles.indexOf(UserSession.getUser().role) !== -1);
            };

            return authService;
        });
})();