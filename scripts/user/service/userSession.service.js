(function(){
    'use strict';

    angular.module('ws.user')
        .service('UserSession', function(localStorageService){
            var _userProps = ['firstName', 'lastName', 'email', 'username', 'role'];
            var user;
            this.getUser = function() {
                if(user === undefined) {
                    user = localStorageService.get('user') || {};
                }
                return user;
            };

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