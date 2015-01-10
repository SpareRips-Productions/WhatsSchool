(function(){
    'use strict';
    angular.module('ws.user')
        .run(function ($rootScope, $state, Auth, AUTH_EVENTS) {
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = (next.data && next.data.authorizedRoles) ? next.data.authorizedRoles : null;
                if (authorizedRoles && !Auth.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (!Auth.isAuthenticated()) {
                        $state.go('welcome');
                        return;
                    }
                }
                if(next.name === 'welcome' && Auth.isAuthenticated()) {
                    event.preventDefault();
                    $state.go('tabs.groups');
                    return;
                } 

            });
        });
})();