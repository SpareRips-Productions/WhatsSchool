(function(){
    'use strict';
    angular.module('ws.announcement')
        .constant('ANNOUNCEMENT_TYPES', {
            calendar: {name: 'Calendar', logo:'ion-calendar'},
            clock: {name: 'Time', logo:'ion-clock'},
            coffee: {name: 'Coffee', logo:'ion-coffee'} 
        });
})();