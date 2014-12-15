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