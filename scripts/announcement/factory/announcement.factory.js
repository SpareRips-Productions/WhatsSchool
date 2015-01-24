(function(){
    'use strict';

    angular.module('ws.announcement')
        .factory('AnnouncementService', function($q, $timeout, UserSession){

            var user = UserSession.user;

            function getAnnouncementsByGroupId(groupId) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var announcements = [
                        {
                            id: 1,
                            logo: 'ion-calendar',
                            name: 'Announcement 1'
                        },
                        {
                            id: 2,
                            logo: 'ion-clock',
                            name: 'Announcement 2'
                        },
                        {
                            id: 3,
                            logo: 'ion-coffee',
                            name: 'Announcement 3'
                        }
                    ];
                    deferred.resolve(announcements);
                }, 1000);
                return deferred.promise;
            }

            function getAnnouncementById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var announcement ={
                        id: 1,
                        groupId: 1,
                        logo: 'ion-calendar',
                        name: 'Announcement 1',
                        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys' + 
                        'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make' +
                        'a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining' +
                        'essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum' +
                        'passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                        comments: [
                            {
                                content: 'Cool',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            },
                            {
                                content: 'Awesome!!!',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            }, 
                            {
                                content: 'Super',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            },                        
                            {
                                content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys' + 
                        'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make' +
                        'a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining' +
                        'essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum' +
                        'passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            },
                            {
                                content: 'Shiiit!',
                                user: { id: 4, firstName: 'Thomas', lastName: 'Hampe'}
                            },     
                        ]            
                    };

                    deferred.resolve(announcement);    
                }, 1000);
                return deferred.promise;
            }

            function newAnnouncement(announcement){
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    deferred.resolve(announcement);
                },1000);
                return deferred.promise;
            }

            function deleteAnnouncement(announcement){
                var deferred = $q.defer();
                $timeout(function(){
                    deferred.resolve(announcement);
                },1000);
                return deferred.promise;   
            }

            return {
                getAnnouncementsByGroupId: getAnnouncementsByGroupId,
                getAnnouncementById: getAnnouncementById,
                newAnnouncement: newAnnouncement,
                deleteAnnouncement: deleteAnnouncement
            };
        });
})();