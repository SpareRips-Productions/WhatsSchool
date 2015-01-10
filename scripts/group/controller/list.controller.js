(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupListCtrl', function(GroupService){
            var vm = this;
            this.groups = [];

            _reload();

            function _reload() {
                GroupService.getGroups().then(function(groups){
                    vm.groups = groups;
                });
            }
        })
    ;
})();