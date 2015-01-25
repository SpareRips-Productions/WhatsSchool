(function(){
    'use strict';

    angular.module('ws.user')
        .factory('Auth', function ($rootScope, $http, $q, $timeout, $ionicHistory, UserSession, USER_ROLES) {
            var authService = {};

            authService.login = function (credentials) {
                //TODO: Implement Login Api
                var deferred = $q.defer();

                $timeout(function(){
                    var user;
                    if(credentials.username === 'thomas') {
                        user = {
                            id: 1,
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        };
                        UserSession.create(user);
                        deferred.resolve(user);
                    } else if(credentials.username === 'admin') {
                        user = {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        };
                        UserSession.create(user);
                        deferred.resolve(user);
                    } else {
                        deferred.reject({ message: 'Username or Password invalid' });
                    }
                }, 300);

                deferred.promise.then(function(user){
                    $rootScope.$broadcast('ws.user.login', user);
                });

                return deferred.promise;
            };

            authService.register = function(credentials) {
                var deferred = $q.defer();
                //TODO: Login API
                return this.login(credentials);
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