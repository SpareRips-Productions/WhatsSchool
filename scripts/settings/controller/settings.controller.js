(function(){
    'use strict';

    angular.module('ws.settings')
        .controller('SettingsCtrl', function($scope, $state, Auth, UserSession, WsSettings,SETTINGS){
            var vm = this;
            var unBindSettings;
            var unBindUser;            
            $scope.SETTINGS = SETTINGS;

            function _unBind() {
                if(unBindSettings) {
                    unBindSettings();
                    unBindSettings = null;
                }
                if(unBindUser) {
                    unBindUser();
                    unBindUser = null;
                }
            }

            function _bind() {

                unBindSettings = WsSettings.bind($scope);
                unBindUser = UserSession.bindUser($scope);
                $scope.settings = $scope[WsSettings.getSettingsKey()];
            }            

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

            // Execute action on hide modal
            $scope.$on('modal.hidden', _unBind);
            // Execute action on remove modal
            $scope.$on('modal.removed', _unBind);
            // Execute action on show modal
            $scope.$on('modal.shown', _bind);

            $scope.$on('$destroy', function() {
                if($scope.settingsModal) {
                    $scope.settingsModal.remove();
                }
            });


        });
})();