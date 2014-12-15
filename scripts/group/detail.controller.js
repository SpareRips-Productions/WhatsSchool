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