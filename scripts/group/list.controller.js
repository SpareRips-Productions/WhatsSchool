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