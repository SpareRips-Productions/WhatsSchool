(function(){
	'use strict';

	angular.module('ws.app')
		.config(function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('tabs', {
					url: '/tabs',
					abstract: true,
					templateUrl: 'templates/tabs.html'
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
							templateUrl: 'templates/user/groupUsers.html',
							controller: 'GroupMembersCtrl as ctrl'
						}
					}
				})
				.state('tabs.contacts', {
					url: '/contacts',
					views: {
						'tab-contacts': {
							templateUrl: 'templates/user/list.html'
						}
					}
					
				})
				.state('tabs.settings', {
					url: '/settings',
					views: {
						'tab-settings': {
							templateUrl: 'templates/settings.html'
						}
					}
				})
			;
			
			$urlRouterProvider.otherwise('/tabs/groups');
		});
})();