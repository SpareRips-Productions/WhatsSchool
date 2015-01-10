(function(){
    'use strict';

    angular.module('ws.user')
        .service('UserSession', function(localStorageService){
            var _userProps = ['firstName', 'lastName', 'email', 'username', 'role'];
            
            this.getUser = function() {
                return localStorageService.get('user') || {};
            };

            this.create = function (user) {
                localStorageService.set('user', user);
            };
            this.destroy = function () {
                localStorageService.set('user', {});
            };
              return this;
        });
})();