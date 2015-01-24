(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AnnouncementDetailCtrl', function($stateParams, $ionicScrollDelegate, $ionicActionSheet, $ionicHistory, GroupService, AnnouncementService, UserSession){
            var vm = this;
            this.announcement = {};
            this.group = {};

            this.newComment = '';
            var user = UserSession.getUser();

            

            function _reload() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementById($stateParams.id).then(function(announcement){
                    vm.announcement = announcement;
                    $ionicScrollDelegate.scrollBottom();
                });
            }

            this.edit = function(){
                var editSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Edit Announcement',
                    cancelText: 'Cancel',
                    destructiveButtonClicked: function(){
                        AnnouncementService.deleteAnnouncement(vm.announcement).then(function(){
                            editSheet();
                            $ionicHistory.goBack();
                        }, function(){
                            editSheet();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });
            };

            this.isCurrentUserComment = function(comment) {
                return comment.user.id === user.id;
            };

            this.sendNewComment = function() {
                var comment = {user: user, content: this.newComment};
                if(this.announcement.comments) {
                    this.announcement.comments.push(comment);
                    this.newComment = '';
                }
                $ionicScrollDelegate.scrollBottom();
            };

            _reload();

        });
})();