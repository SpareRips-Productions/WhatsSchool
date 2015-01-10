(function(){
    'use strict';

    angular.module('ws.user')
        .constant('USER_ROLES', {
            all:        '*',
            admin:      'admin',
            teacher:    'teacher',
            student:    'student',
        });
})();