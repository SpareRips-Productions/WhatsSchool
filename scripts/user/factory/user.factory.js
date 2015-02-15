(function(){
    'use strict';

     angular.module('ws.group')
        .factory('UserService', function($rootScope, $sailsPromised, RELOAD){

            function getUsers() {
                return $sailsPromised.get('/users');
            }

            function getUsersByGroupId(groupId) {
                return $sailsPromised.get('/groups/' + groupId + '/members')
            }

            function newUser(user) {
                return $sailsPromised.post('/users', user).then(function(newUser){
                    $rootScope.$broadcast(RELOAD.USER, {verb: 'created', data: newUser});
                    return newUser;
                });
            }

            function deleteUser(user) {
                return $sailsPromised.delete('/users/' + user.id).then(function(deletedUser){
                    $rootScope.$broadcast(RELOAD.USER, {verb: 'deleted', data: deletedUser});
                    return deletedUser;
                });
            }

            function getUserById(id) {
                return $sailsPromised.get('/users/'+id);
            }

            function deleteUserFromGroup(user, groupId) {
                return $sailsPromised.delete('/groups/'+ groupId + '/members/' + user.id).then(function(deletedUser){
                    $rootScope.$broadcast(RELOAD.USER);
                    return deletedUser;
                });;
            }

            function addUserToGroup(user, groupId) {
                return $sailsPromised.post('/groups/'+ groupId + '/members/' + user.id).then(function(newUser){
                    $rootScope.$broadcast(RELOAD.USER, {verb: 'created', data: newUser});
                    return newUser;
                });
            }

            return {
                getUsers: getUsers,
                newUser: newUser,
                deleteUser: deleteUser,
                getUsersByGroupId: getUsersByGroupId,
                getUserById: getUserById,
                deleteUserFromGroup: deleteUserFromGroup,
                addUserToGroup: addUserToGroup
            };
        });
})();