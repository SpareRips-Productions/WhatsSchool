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
                            id: 1,
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        },
                        {
                            id: 3,
                            firstName: 'Thomas 5', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 4,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 5,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 6,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 7,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
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
                            id: 1,
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
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
                        id: 3,
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

            function deleteUserFromGroup(user, groupId) {
                var userId = (angular.isObject(user)) ? user.id : user;
                var deferred = $q.defer();
                $timeout(function(){
                    return deferred.resolve(true);
                }, 1000);
                return deferred.promise;
            }

            function addUserToGroup(user, groupId) {
                var deferred = $q.defer();
                $timeout(function(){
                    return deferred.resolve(true);
                }, 1000);
                return deferred.promise;
            }

            return {
                getUsers: getUsers,
                getUsersByGroupId: getUsersByGroupId,
                getUserById: getUserById,
                deleteUserFromGroup: deleteUserFromGroup,
                addUserToGroup: addUserToGroup
            };
        });
})();