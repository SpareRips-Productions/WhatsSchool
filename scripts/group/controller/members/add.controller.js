(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddMembersCtrl', function($scope, $q, $stateParams, $ionicPopup, UserService, GroupService){
            var vm = this;
            vm.group = {};
            vm.members = [];
            vm.users = [];

            function _reset() {
                vm.title = 'add Members';
            }
            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                $q.all([UserService.getUsers(), UserService.getUsersByGroupId()]).then(function(results){
                    vm.users = results[0];
                    vm.members = results[1];
                    var isInGroup = {};
                    for(var i in vm.members) {
                        isInGroup[vm.members[i].id] = true;
                    }

                    angular.forEach(vm.users, function(user, key){
                        vm.users[key].isInGroup = !!isInGroup[user.id];
                        vm.users[key].wasInGroup = !!isInGroup[user.id];

                    })
                });
            }

            _reset();
            _reload();

            this.add = function(){
                this.title = 'Please wait...';
                var usersAddToGroup = []
                var user;
                for(var i = 0; i < vm.users.length; i++) {
                    user = vm.users[i];
                    if(user.isInGroup && !user.wasInGroup){
                        usersAddToGroup.push(UserService.addUserToGroup(user, vm.group.id));
                    }
                }
                $q.all(usersAddToGroup).then(function(){
                    _reset();
                    if($scope.addMembersModal) {
                        $scope.addMembersModal.hide();
                    }
                }, function(error){
                    self.title = 'add Members';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });

            };

            this.cancel = function() {
                if($scope.addMembersModal) {
                    $scope.addMembersModal.hide();
                }
            };

            


        });
})();