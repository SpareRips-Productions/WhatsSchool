(function(){
    'use strict';

    angular.module('ws.app')
        .config(function($stateProvider, $urlRouterProvider, USER_ROLES) {
            $stateProvider
                .state('tabs', {
                    url: '/tabs',
                    abstract: true,
                    templateUrl: 'templates/tabs.html',
                    data: {
                        authorizedRoles: [USER_ROLES.student, USER_ROLES.teacher, USER_ROLES.admin]
                    }
                })
                .state('tabs.groups', {
                    url: '/groups',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/group/list.html',
                            controller: 'GroupListCtrl as ctrl'
                        }
                    }
                    
                })
                .state('tabs.groups-announcement', {
                    url: '/groups/:groupId/announcement/:announcementId',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/announcement/detail.html',
                            controller: 'AnnouncementDetailCtrl as ctrl'
                        }
                    }
                    
                })
                .state('tabs.groups-detail', {
                    url: '/groups/:id',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/group/detail.html',
                            controller: 'GroupDetailCtrl as ctrl'
                        }
                    }
                    
                })
                .state('tabs.groups-members', {
                    url: '/groups/:id/members',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/group/members.html',
                            controller: 'GroupMembersCtrl as MembersCtrl'
                        }
                    }
                })
                .state('tabs.settings', {
                    url: '/settings',
                    views: {
                        'tab-settings': {
                            templateUrl: 'templates/settings.html',
                            controller: 'SettingsCtrl as ctrl'
                        }
                    }
                })
                .state('welcome', {
                    url: '/welcome',
                    templateUrl: 'templates/welcome.html',
                    controller: 'WelcomeCtrl as ctrl'
                })
            ;
            
            $urlRouterProvider.otherwise( function($injector, $location) {
                var $state = $injector.get('$state');
                $state.go('welcome');
            });
        });
})();