(function(){
    'use strict';

    angular.module('ws.user')
        .controller('AclCtrl', function($rootScope, Auth, USER_ROLES){
            var vm = this;

            vm.isAuthorized = function(groups) {
                return Auth.isAuthorized(groups);
            };

            vm.isAdmin = function() {
                return Auth.isAuthorized([USER_ROLES.admin]);
            };

            vm.isTeacher = function() {
                return Auth.isAuthorized([USER_ROLES.teacher, USER_ROLES.admin])
            };

            vm.isStudent = function() {
                return Auth.isAuthorized(USER_ROLES.student, USER_ROLES.teacher, USER_ROLES.admin);
            };
            vm.USER_ROLES = USER_ROLES;
        });
})();