(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddGroupCtrl', function($q, $scope, $ionicPopup, GroupService, UserSession, UserService){
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
                    
                    if($scope.addGroupModal) {
                        UserService
                            .addUserToGroup(UserSession.getUser(), group.id)
                            .then(function(){
                                _reset();
                                $scope.addGroupModal.hide();
                            }, function(error){
                                self.title = 'new Group';
                                $ionicPopup.alert({
                                    title: 'Ooops :(',
                                    template: error.message || 'Please try again later...'
                                });
                            });                        
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