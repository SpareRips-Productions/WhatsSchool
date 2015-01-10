(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupMembersCtrl', function($stateParams, GroupService, UserService){
            var vm = this;
            this.group = {};
            this.memebrs = [];

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }
        });
})();