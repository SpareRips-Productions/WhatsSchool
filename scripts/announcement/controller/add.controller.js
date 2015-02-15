(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AddAnnouncementCtrl', function($rootScope, $scope, $ionicPopup, $stateParams, ANNOUNCEMENT_TYPES, AnnouncementService, GroupService, RELOAD){
            var vm = this;
            function _reset() {
                vm.announcement = {
                    name: '',
                    description: '',
                    logo: ANNOUNCEMENT_TYPES.calendar.logo,
                    group: {} 
                };
                vm.title = 'new Announcement';
            };
            _reset();

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.announcement.group = group;
                });
            };
            _reloadGroup();
            $rootScope.$on(RELOAD.GROUP, _reloadGroup);

            this.add = function(){
                this.title = 'Please wait...';
                AnnouncementService.newAnnouncement(vm.announcement).then(function(announcement) {
                    _reset();
                    if($scope.addAnnouncementModal) {
                        $scope.addAnnouncementModal.hide();
                    }
                }, function (error) {
                    self.title = 'new Announcement';
                    console.log(error);
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.types = ANNOUNCEMENT_TYPES;

            this.cancel = function() {
                if($scope.addAnnouncementModal) {
                    $scope.addAnnouncementModal.hide();
                }
            };






        });
})();