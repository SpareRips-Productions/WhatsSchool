(function(){
    'use strict';

    angular.module('ws.app').config(function(gravatarServiceProvider){
        gravatarServiceProvider.defaults = {
          size     : 80,
          default: 'mm'  // Mystery man as default for missing avatars
        };

        // Use https endpoint
        gravatarServiceProvider.secure = true;

        // Force protocol
        gravatarServiceProvider.protocol = 'https';
    });
})();