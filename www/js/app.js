(function(){

'use strict';

angular.module('ws.app', ['ionic', 'ws.group', 'ws.announcement'])
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

	angular.module('ws.announcement', ['ionic']);
})();
(function() {
	'use strict';

	angular.module('ws.group', ['ionic']);
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
		}]);
})();
(function(){
	'use strict';

	angular.module('ws.announcement')
		.controller('AnnouncementDetailCtrl', function(){
			this.announcement = {
				id: 1,
				logo: 'ion-calendar',
				name: 'Announcement 1',
				description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys' 
						   + 'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make' 
						   + 'a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining'
						   + 'essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum' 
						   + 'passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
				comments: [
					{
						content: 'Cool',
						user: { id: 1, name: 'John Doe'}
					},
					{
						content: 'Awesome!!!',
						user: { id: 1, name: 'John Doe'}
					}, 
					{
						content: 'Super',
						user: { id: 1, name: 'John Doe'}
					}  
				]			
			};

			this.group = {
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


		});
})();
(function(){
	'use strict';

	angular.module('ws.group')
		.controller('GroupDetailCtrl', function(){
			this.group = {
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

			this.members = this.group.members;

			this.announcements = this.group.announcements;

			this.getMemberNames = function() {
				var members = [];
				for(var i = 0; i < this.members.length; i += 1) {
					members.push(this.members[i].name);
				}
				return members;
			};

		});
})();
(function(){
	'use strict';

	angular.module('ws.group')
		.controller('GroupListCtrl', function(){
			
			this.groups = [
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
		})
	;
})();
(function(){
	'use strict';

	angular.module('ws.group')
		.controller('GroupMembersCtrl', function(){
			this.group = {
				id: 1, 
				name: 'Group 1', 
				owner: 'Owner',
				announcements: [
					{
						logo: 'ion-calendar',
						name: 'Announcement 1'
					},
					{
						logo: 'ion-clock',
						name: 'Announcement 2'
					},
					{
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
		});
})();