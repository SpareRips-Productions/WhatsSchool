(function(){
    'use strict';
    angular.module('ws.api')
        .run(function($rootScope, $sails, RELOAD, ENTITIES){
            $sails.on('connect', function(){
                angular.forEach(ENTITIES, function(entityName, entityId){
                    if(RELOAD[entityId]) {
                        $sails.on(entityName, function(message){
                            $rootScope.$broadcast(RELOAD[entityId], message);
                        });
                    }
                });
            });
        });
})();