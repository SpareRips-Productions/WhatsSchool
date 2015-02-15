(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AnnouncementDetailCtrl', function(
                $rootScope,
                $stateParams, 
                $ionicScrollDelegate, 
                $ionicActionSheet, 
                $ionicHistory, 
                GroupService, 
                AnnouncementService, 
                UserSession,
                CommentService,
                RELOAD
            ){
            var vm = this;
            this.announcement = {};
            this.group = {};
            this.comments = [];

            this.newComment = '';
            var user = UserSession.getUser();

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
            }

            function _reloadAnnouncement() {
                AnnouncementService.getAnnouncementById($stateParams.announcementId).then(function(announcement){
                    vm.announcement = announcement;
                    
                });
            }

            function _reloadComments() {
                CommentService.getCommentsByAnnouncementId($stateParams.announcementId).then(function(comments){
                    vm.comments = comments;
                    $ionicScrollDelegate.scrollBottom();
                });
                
            }

            function _reload() {
                _reloadGroup();
                _reloadAnnouncement();
                _reloadComments();
            }

            $rootScope.$on(RELOAD.GROUP, _reloadGroup);
            $rootScope.$on(RELOAD.ANNOUNCEMENT, _reloadAnnouncement);
            $rootScope.$on(RELOAD.COMMENT, function(message, payload){
                if(payload && payload.data && payload.data.announcement == vm.announcement.id) {
                    CommentService.getCommentsByAnnouncementId($stateParams.announcementId).then(function(comments){
                        vm.comments = comments;
                        $ionicScrollDelegate.scrollBottom();
                    });
                }
                
            });

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
                var comment = {user: user, text: this.newComment, announcement: this.announcement};
                CommentService.newComment(comment).then(function(newComment){
                    vm.newComment = '';
                });                
            };

            _reload();

        });
})();