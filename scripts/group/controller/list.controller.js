(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupListCtrl', function($scope, $ionicModal, GroupService){
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

            function _reload() {
                GroupService.getGroups().then(function(groups){
                    vm.groups = groups;
                });
            }
            _reload();
        })
    ;
})();