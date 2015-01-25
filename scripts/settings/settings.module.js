(function(){
    'use strict';

    angular.module('ws.settings', ['ionic', 'ui.gravatar', 'ws.user'])
        .run(function($rootScope, $timeout, Theme, SETTINGS_EVENTS){
            $rootScope.$broadcast(SETTINGS_EVENTS.CHECK_THEME);
        })
    ;
})();