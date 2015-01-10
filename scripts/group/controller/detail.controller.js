(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupDetailCtrl', function($stateParams, GroupService, AnnouncementService, UserService){
            var vm = this;
            this.group = {};

            this.members = [];

            this.announcements = [];

            this.getMemberNames = function() {
                var members = [];
                for(var i = 0; i < this.members.length; i += 1) {
                    members.push(this.members[i].firstName + ' ' + this.members[i].lastName);
                }
                return members;
            };

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementsByGroupId($stateParams.id).then(function(announcements){
                    vm.announcements = announcements;
                });
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

        });
})();