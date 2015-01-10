(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AnnouncementDetailCtrl', function($stateParams, $ionicScrollDelegate, GroupService, AnnouncementService, UserSession){
            var vm = this;
            this.announcement = {};
            this.group = {};

            this.newComment = "";
            var user = UserSession.getUser();

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementById($stateParams.id).then(function(announcement){
                    vm.announcement = announcement;
                    $ionicScrollDelegate.scrollBottom();
                });
            }

            this.isCurrentUserComment = function(comment) {
                return comment.user.id === user.id;
            }

            this.sendNewComment = function() {
                var comment = {user: user, content: this.newComment};
                if(this.announcement.comments) {
                    this.announcement.comments.push(comment);
                    this.newComment = "";
                }
                $ionicScrollDelegate.scrollBottom();
            }

        });
})();