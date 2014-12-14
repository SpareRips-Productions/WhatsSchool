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
							templateUrl: 'templates/tabs/groups.html'
						}
					}
					
				})
				.state('tabs.contacts', {
					url: '/contacts',
					views: {
						'tab-contacts': {
							templateUrl: 'templates/tabs/contacts.html'
						}
					}
					
				})
				.state('tabs.settings', {
					url: '/settings',
					views: {
						'tab-settings': {
							templateUrl: 'templates/tabs/settings.html'
						}
					}
				})
			;
			
			$urlRouterProvider.otherwise('/tabs/groups');
		});
})();