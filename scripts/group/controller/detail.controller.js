(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupDetailCtrl', function(
                $rootScope,
                $scope, 
                $stateParams, 
                $ionicActionSheet, 
                $ionicHistory, 
                $ionicPopup, 
                $ionicModal, 
                $ionicListDelegate, 
                GroupService, 
                AnnouncementService, 
                UserService,
                UserSession,
                RELOAD
            ){
            var vm = this;
            this.group = {};
            $scope.group = {};

            this.members = [];

            this.announcements = [];

            this.getMemberNames = function() {
                var members = [];
                for(var i = 0; i < this.members.length; i += 1) {
                    members.push(this.members[i].firstName + ' ' + this.members[i].lastName);
                }
                return members;
            };

            this.delete = function(){
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Are you sure?',
                    cancelText: 'Cancel',
                    destructiveButtonClicked: function(){
                        GroupService.deleteGroup(vm.group).then(function(){
                            deleteSheet();
                            $ionicHistory.goBack();
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


            $ionicModal.fromTemplateUrl('templates/announcement/add.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addAnnouncementModal = modal;
            });

            this.addAnnouncement = function(){
                if($scope.addAnnouncementModal) {
                    $scope.addAnnouncementModal.show();
                } 
            }

            this.canDelete = function() {
                return vm.isOwner();
            }

            this.isOwner = function() {
                return vm.group && vm.group.owner && UserSession.getUser().id === vm.group.owner.id;
            }

            this.deleteAnnouncement = function(announcement) {
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Delete ' + announcement.name + ', are you sure?',
                    cancelText: 'Cancel',
                    cancel: function(){
                        $ionicListDelegate.closeOptionButtons();
                    },
                    destructiveButtonClicked: function(){
                        AnnouncementService.deleteAnnouncement(announcement).then(function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                        }, function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });

                return true;
            }
            
            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                    $scope.group = group;
                });
            }

            function _reloadAnnouncements() {
                AnnouncementService.getAnnouncementsByGroupId($stateParams.id).then(function(announcements){
                    vm.announcements = announcements;
                });
            }

            function _reloadMembers() {
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

            (function _reload() {
                _reloadGroup();
                _reloadAnnouncements();
                _reloadMembers();                
            })();
            $rootScope.$on(RELOAD.GROUP, _reloadGroup);
            $rootScope.$on(RELOAD.ANNOUNCEMENT, _reloadAnnouncements);
            $rootScope.$on(RELOAD.USER, _reloadMembers);

        });
})();