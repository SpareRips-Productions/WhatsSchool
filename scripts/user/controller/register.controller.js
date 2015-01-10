(function(){
    'use strict';
    angular.module('ws.user')
        .controller('RegisterCtrl', function LoginCtrl($rootScope, $scope, $ionicPopup, AUTH_EVENTS, Auth){
            this.credentials = {};
            this.title = '';
            var self = this;
            this.register = function(){
                this.title = 'Please wait...';
                Auth.register(this.credentials).then(function(user) {
                    _init();
                    if($scope.registerModal) {
                        $scope.registerModal.hide();
                    }
                }, function (error) {
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.cancel = function() {
                if($scope.registerModal) {
                    $scope.registerModal.hide();
                }
            };

            function _init(){
                self.credentials = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    username: '',
                    password: ''
                };
                self.title = 'Register';
            }
            _init();

        });
})();