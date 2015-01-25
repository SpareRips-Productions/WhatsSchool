(function(){
    'use strict';

    angular.module('ws.user')
        .service('UserSession', function($rootScope, localStorageService){
            var _userProps = ['firstName', 'lastName', 'email', 'username', 'role'];
            var user;
            this.getUser = function() {
                if(user === undefined) {
                    user = localStorageService.get('user') || {};
                }
                return user;
            };

            $rootScope.$on('LocalStorageModule.notification.setitem', function(event, data){
                if(data.key === 'user') {
                    user = localStorageService.get('user');
                }
            });


            this.bindUser = function(scope) {
                return localStorageService.bind(scope, 'user');
            }

            this.create = function (user) {
                this.destroy();
                localStorageService.set('user', user);
                return this.getUser();
            };
            this.destroy = function () {
                user = undefined;
                localStorageService.set('user', {});
            };
            return this;
        });
})();