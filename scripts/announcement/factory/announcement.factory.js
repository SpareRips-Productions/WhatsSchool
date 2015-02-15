(function(){
    'use strict';

    angular.module('ws.announcement')
        .factory('AnnouncementService', function($rootScope, $sailsPromised, RELOAD){

            function getAnnouncementsByGroupId(groupId) {
                return $sailsPromised.get('/groups/'+groupId+'/announcements');   
            }

            function getAnnouncementById(id) {
                return $sailsPromised.get('/announcements/'+id);    
            }

            function newAnnouncement(announcement){
                return $sailsPromised.post('/announcements', announcement).then(function(newAnnouncement){
                    $rootScope.$broadcast(RELOAD.ANNOUNCEMENT, {verb: 'created', data: newAnnouncement});
                    return newAnnouncement;
                });
            }

            function deleteAnnouncement(announcement){
                return $sailsPromised.delete('/announcements/' + announcement.id).then(function(deletedAnnouncement){
                    $rootScope.$broadcast(RELOAD.ANNOUNCEMENT, {verb: 'deleted', data: deletedAnnouncement});
                    return deletedAnnouncement;
                });  
            }

            return {
                getAnnouncementsByGroupId: getAnnouncementsByGroupId,
                getAnnouncementById: getAnnouncementById,
                newAnnouncement: newAnnouncement,
                deleteAnnouncement: deleteAnnouncement
            };
        });
})();