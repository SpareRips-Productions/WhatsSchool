(function(){
    'use strict';

    angular.module('ws.settings')
        .controller('SettingsCtrl', function($scope, $state, Auth, UserSession){
            var vm = this;

            this.logout = function() {
                Auth.logout();
                vm.done();
                $state.go('welcome');
                
            };
            this.done = function() {
                if($scope.settingsModal) {
                    $scope.settingsModal.hide();
                }
            };
            this.user = UserSession.getUser();
        });
})();