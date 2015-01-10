(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AnnouncementDetailCtrl', function($stateParams, GroupService, AnnouncementService){
            var vm = this;
            this.announcement = {};
            this.group = {};

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementById($stateParams.id).then(function(announcement){
                    vm.announcement = announcement;
                });
            }


        });
})();