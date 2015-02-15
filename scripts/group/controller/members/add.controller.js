(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddMembersCtrl', function(
                $rootScope, 
                $scope, 
                $q, 
                $stateParams, 
                $ionicPopup, 
                UserService, 
                GroupService,
                RELOAD
            ){
            var vm = this;
            vm.group = {};
            vm.members = [];
            vm.users = [];

            function _reset() {
                vm.title = 'add Members';
            }

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
            }

            function _reloadMembers() {
                $q.all([UserService.getUsers(), UserService.getUsersByGroupId($stateParams.id)]).then(function(results){
                    vm.users = results[0];
                    vm.members = results[1];
                    var isInGroup = {};
                    for(var i in vm.members) {
                        isInGroup[vm.members[i].id] = true;
                    }

                    angular.forEach(vm.users, function(user, key){
                        vm.users[key].isInGroup = !!isInGroup[user.id] || !!vm.users[key].isInGroup;
                        vm.users[key].wasInGroup = !!isInGroup[user.id];
                    })
                });
            }

            function _reload() {
                _reloadGroup();
                _reloadMembers();
            }

            _reset();
            _reload();

            $rootScope.$broadcast(RELOAD.USER, _reloadMembers);
            $rootScope.$broadcast(RELOAD.GROUP, _reloadGroup);

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