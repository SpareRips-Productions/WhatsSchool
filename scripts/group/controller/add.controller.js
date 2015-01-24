(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddGroupCtrl', function($scope, $ionicPopup, GroupService, UserSession){
            var vm = this;
            function _reset() {
                vm.group = {
                    name: '',
                    owner: UserSession.getUser()
                };
                vm.title = 'new Group';
            }
            _reset();

            this.add = function(){
                this.title = 'Please wait...';
                GroupService.newGroup(vm.group).then(function(group) {
                    _reset();
                    if($scope.addGroupModal) {
                        $scope.addGroupModal.hide();
                    }
                }, function (error) {
                    self.title = 'new Group';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.cancel = function() {
                if($scope.addGroupModal) {
                    $scope.addGroupModal.hide();
                }
            };


        });
})();