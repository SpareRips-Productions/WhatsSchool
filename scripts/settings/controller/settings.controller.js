(function(){
    'use strict';

    angular.module('ws.settings')
        .controller('SettingsCtrl', function($state, Auth, UserSession){
            this.logout = function() {
                Auth.logout();
                $state.go('welcome');
            };
            this.user = UserSession.getUser();
        });
})();