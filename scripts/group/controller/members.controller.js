(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupMembersCtrl', function(
                $rootScope, 
                $scope, 
                $stateParams, 
                $ionicActionSheet, 
                $ionicListDelegate, 
                $ionicModal, 
                $ionicPopup, 
                GroupService, 
                UserService, 
                UserSession,
                RELOAD
            ){
            var vm = this;
            var currentUser = UserSession.getUser();
            this.group = {};
            this.members = [];

            this.isLoggedIn = function(user){
                return user.id === currentUser.id;
            }

            this.canDelete = function(user){
                return !this.isLoggedIn(user) && this.group.owner.id == currentUser.id;
            }

            this.delete = function(user){
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Remove',
                    titleText: 'Remove <strong>' + user.firstName + ' ' + user.lastName + '</strong> from this Group?',
                    cancelText: 'Cancel',
                    cancel: function(){
                        $ionicListDelegate.closeOptionButtons();
                    },
                    destructiveButtonClicked: function(){
                        UserService.deleteUserFromGroup(user, vm.group.id).then(function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                        }, function(){
                            deleteSheet();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });
            };

            $ionicModal.fromTemplateUrl('templates/group/members/add.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addMembersModal = modal;
            });

            this.addMembers = function(){
                if($scope.addMembersModal) {
                    $scope.addMembersModal.show();
                } 
            }

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
            }

            function _reloadMembers() {
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

            function _reload() {
                _reloadGroup();
                _reloadMembers();
            }
            _reload();

            $rootScope.$on(RELOAD.GROUP, _reloadGroup);
            $rootScope.$on(RELOAD.USER, _reloadMembers);
        });
})();