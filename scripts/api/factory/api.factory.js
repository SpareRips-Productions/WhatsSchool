(function(){
    'use strict';

    angular.module('ws.api')
        .factory('$sailsPromised', function($sails, $q){
            function promised$sailsConnection(method, route, data){
                var deferred = $q.defer();
                if(!$sails._raw || !$sails._raw.connected){
                    $sails.on('connect', function(){
                        deferred.resolve($sails[method](route, data));
                    });
                } else {
                    deferred.resolve($sails[method](route, data));
                }
                return deferred.promise;
            }

            // expose $sails functions
            return {
                get: function(route, data){
                    return promised$sailsConnection('get', route, data);
                },
                post: function(route, data){
                    return promised$sailsConnection('post', route, data);
                },
                put: function(route, data){
                    return promised$sailsConnection('put', route, data);
                },
                delete: function(route, data){
                    return promised$sailsConnection('delete', route, data);
                }
            }
        })
})();