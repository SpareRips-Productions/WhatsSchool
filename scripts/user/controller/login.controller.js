(function(){
    'use strict';
    angular.module('ws.user')
        .controller('LoginCtrl', function LoginCtrl($rootScope, $scope, $ionicPopup, AUTH_EVENTS, Auth){
            this.credentials = {
                username: '',
                password: ''
            };
            this.title = 'Login';
            var self = this;
            this.login = function(){
                this.title = 'Please wait...';
                Auth.login(this.credentials).then(function(user) {
                    self.title = 'Login';
                    self.credentials = {
                        username: '',
                        password: ''
                    };
                    if($scope.loginModal) {
                        $scope.loginModal.hide();
                    }
                }, function (error) {
                    self.title = 'Login';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.cancel = function() {
                if($scope.loginModal) {
                    $scope.loginModal.hide();
                }
            };

        });
})();