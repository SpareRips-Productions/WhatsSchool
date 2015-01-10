(function(){
    'use strict';

     angular.module('ws.group')
        .factory('UserService', function($q, $timeout, UserSession, USER_ROLES){

            var user = UserSession.user;

            function getUsers() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var users = [
                        {
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            firstName: 'Administratore', 
                            lastName: 'Admin', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        }
                    ];
                    deferred.resolve(users);
                }, 1000);
                return deferred.promise;
            }

            function getUsersByGroupId(groupId) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var users = [
                        {
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            firstName: 'Administratore', 
                            lastName: 'Admin', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        }
                    ];
                    deferred.resolve(users);
                }, 1000);
                return deferred.promise;
            }

            function getUserById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var user = {
                        firstName: 'Thomas', 
                        lastName: 'Hampe',     
                        username: 'thomas',
                        email: 'thomas@hampe.co', 
                        role: USER_ROLES.student
                    };

                    deferred.resolve(user);    
                }, 1000);
                return deferred.promise;
            }

            return {
                getUsers: getUsers,
                getUsersByGroupId: getUsersByGroupId,
                getUserById: getUserById
            };
        });
})();