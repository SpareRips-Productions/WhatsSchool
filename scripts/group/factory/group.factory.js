(function(){
    'use strict';

    angular.module('ws.group')
        .factory('GroupService', function($rootScope, $sailsPromised,RELOAD) {

            function getGroups() {
                return $sailsPromised.get("/groups");
            }

            function getGroupById(id) {
                return $sailsPromised.get("/groups/"+id);
            }

            function newGroup(group) {
                return $sailsPromised.post('/groups', group).then(function(createdGroup){
                    $rootScope.$broadcast(RELOAD.GROUP,{verb: 'created', data: createdGroup});
                    return createdGroup;
                });
            }

            function deleteGroup(group) {
                return $sailsPromised.delete('/groups/'+group.id).then(function(deletedGroup){
                    $rootScope.$broadcast(RELOAD.GROUP,{verb: 'deleted', data: deletedGroup});
                    return deletedGroup;
                });
            }

            return {
                getGroups: getGroups,
                getGroupById: getGroupById,
                newGroup: newGroup,
                deleteGroup: deleteGroup
            };

        })
    ;
})();