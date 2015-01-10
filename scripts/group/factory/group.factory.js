(function(){
    'use strict';

    angular.module('ws.group')
        .factory('GroupService', function($q, $timeout, UserSession){
            return {
                getGroups: getGroups,
                getGroupById: getGroupById
            };

            var user = UserSession.user;

            function getGroups() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var groups = [
                        {
                            id: 1,
                            name: 'Group 1',
                            owner: 'Owner'
                        },
                        {
                            id: 1,
                            name: 'Group 2',
                            owner: 'Owner 2'
                        }
                    ];
                    deferred.resolve(groups);
                }, 1000);
                return deferred.promise;
            };

            function getGroupById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var group = {
                        id: 1, 
                        name: 'Group 1', 
                        owner: 'Owner',
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
            };
        })
    ;
})();