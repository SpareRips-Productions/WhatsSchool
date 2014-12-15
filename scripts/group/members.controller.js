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