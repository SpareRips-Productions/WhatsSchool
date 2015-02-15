(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupListCtrl', function(
            $rootScope,
            $scope, 
            $ionicModal, 
            $ionicActionSheet, 
            $ionicPopup, 
            $ionicListDelegate, 
            $sails, 
            GroupService,
            UserService, 
            UserSession,
            RELOAD
        ){
            var vm = this;
            this.groups = [];
            this.openAddGroupModal = function(){
                if($scope.addGroupModal) {
                    $scope.addGroupModal.show();
                }                
            };
            $ionicModal.fromTemplateUrl('templates/group/add.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addGroupModal = modal;
            });

            this.openSettingsModal = function(){
                if($scope.settingsModal) {
                    $scope.settingsModal.show();
                }                
            };
            $ionicModal.fromTemplateUrl('templates/settings.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.settingsModal = modal;
            });

            this.canDelete = function(group) {
                return UserSession.getUser().id == group.owner.id;
            }

            this.delete = function(group){
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Delete ' + group.name +', are you sure?',
                    cancelText: 'Cancel',
                    cancel: function(){
                        $ionicListDelegate.closeOptionButtons();
                    },
                    destructiveButtonClicked: function(){
                        GroupService.deleteGroup(group).then(function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                            $rootScope.$broadcast(RELOAD.GROUP, {verb: 'deleted', data: group});
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

            function _reload() {
                GroupService.getGroups().then(function(groups){
                    vm.groups = groups;
                });
            };
            _reload();
            $rootScope.$on(RELOAD.GROUP, _reload);
        })
    ;
})();