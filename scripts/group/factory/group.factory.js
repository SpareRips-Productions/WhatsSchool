(function(){
    'use strict';

    angular.module('ws.group')
        .factory('GroupService', function($q, $timeout, UserSession, UserService, USER_ROLES){
            var user = UserSession.user;

            function getGroups() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var groups = [
                        {
                            id: 1,
                            name: 'Group 1',
                            owner: {
                                id: 2,
                                firstName: 'Admini', 
                                lastName: 'Stratore', 
                                username: 'admin',
                                email: 'admin@hampe.co', 
                                role: USER_ROLES.admin
                            }
                        },
                        {
                            id: 1,
                            name: 'Group 2',
                            owner: {
                                id: 2,
                                firstName: 'Admini', 
                                lastName: 'Stratore', 
                                username: 'admin',
                                email: 'admin@hampe.co', 
                                role: USER_ROLES.admin
                            }
                        }
                    ];
                    deferred.resolve(groups);
                }, 1000);
                return deferred.promise;
            }

            function getGroupById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var group = {
                        id: 1, 
                        name: 'Group 1', 
                        owner: {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        },
                        announcements: [
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
                        ],
                        members: [
                            {name: 'John Doe'}, 
                            {name: 'Jane Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}
                        ]
                    };

                    deferred.resolve(group);    
                }, 1000);
                return deferred.promise;
            }

            function newGroup(group) {
                var deferred = $q.defer();
                $timeout(function(){
                    group.id = 3;

                    //after creation add current user to group
                    UserService.addUserToGroup(UserSession.getUser(), group.id).then(function(){
                        getGroupById(group.id).then(function(group){
                            deferred.resolve(group)
                        });
                    }, function(error){
                        deferred.reject(error);
                    });
                    
                }, 1000);

                return deferred.promise;
            }

            function deleteGroup(group) {
                var deferred = $q.defer();
                $timeout(function(){
                    deferred.resolve(group);
                }, 1000);

                return deferred.promise;
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