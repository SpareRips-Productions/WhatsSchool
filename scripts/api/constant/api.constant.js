(function(){
    'use strict';
    angular.module('ws.api')
        .constant('RELOAD', {
            ALL: 'reload_all',
            GROUP: 'reload_group',
            ANNOUNCEMENT: 'reload_announcement',
            USER: 'reload_user',
            COMMENT: 'reload_comment'
        })
        .constant('ENTITIES', {
            GROUP: 'groups',
            ANNOUNCEMENT: 'announcements',
            USER: 'users',
            COMMENT: 'comments'
        });
    ;
})();