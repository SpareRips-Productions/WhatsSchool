(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AddAnnouncementCtrl', function($scope, $ionicPopup, ANNOUNCEMENT_TYPES, AnnouncementService){
            var vm = this;
            function _reset() {
                vm.announcement = {
                    name: '',
                    description: '',
                    logo: ANNOUNCEMENT_TYPES.calendar.logo,
                    group: $scope.group
                };
                vm.title = 'new Announcement';
            }
            _reset();

            this.add = function(){
                this.title = 'Please wait...';
                AnnouncementService.newAnnouncement(vm.Announcement).then(function(Announcement) {
                    _reset();
                    if($scope.addAnnouncementModal) {
                        $scope.addAnnouncementModal.hide();
                    }
                }, function (error) {
                    self.title = 'new Announcement';
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