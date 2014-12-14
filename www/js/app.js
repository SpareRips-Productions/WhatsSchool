(function(){

'use strict';

angular.module('ws.app', ['ionic'])
	.run(["$ionicPlatform", function($ionicPlatform) {
	  	$ionicPlatform.ready(function() {
		    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		    // for form inputs)
		    if(window.cordova && window.cordova.plugins.Keyboard) {
		      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		    }
		    if(window.StatusBar) {
		      // org.apache.cordova.statusbar required
		      StatusBar.styleDefault();
		    }
		});
	}]);

})();
(function(){
	'use strict';

	angular.module('ws.app')
		.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
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
		}]);
})();