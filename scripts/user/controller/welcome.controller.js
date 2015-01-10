(function(){
    'use strict';

    angular.module('ws.user')
        .controller('WelcomeCtrl', function($scope, $state, $ionicModal, Auth){
            this.openLogin = function(){
                $scope.loginModal.show();
            };
            this.openRegister = function(){
                $scope.registerModal.show();
            };
            //Login
            $ionicModal.fromTemplateUrl('templates/user/login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.loginModal = modal;
            });

            //Register
            $ionicModal.fromTemplateUrl('templates/user/register.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.registerModal = modal;
            });

            $scope.$on('$destroy', function() {
                $scope.loginModal.remove();
                $scope.registerModal.remove();
            });



            // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
                if(Auth.isAuthenticated()) {
                    $state.go('tabs.groups');
                }
            });
            // Execute action on remove modal
            $scope.$on('loginModal.removed', function() {
            // Execute action
            });

        });
})();