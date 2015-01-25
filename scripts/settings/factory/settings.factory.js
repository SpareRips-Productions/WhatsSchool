(function(){
    'use strict';

    angular.module('ws.settings')
        .service('WsSettings', function($rootScope, localStorageService, UserSession, SETTINGS, SETTINGS_EVENTS){
            var user;
            var settingsKey;
            var settings;
            var self = this;

            function _initSettings(){
                user = UserSession.getUser()
                settingsKey = 'settings_' + ((user.username) ? user.username : 'general');
                settings = localStorageService.get(settingsKey) || null;
                console.log(settings);
                if(settings == undefined) {
                    var darkMode = SETTINGS.DARK_MODE;
                    var autoDark = SETTINGS.AUTO_DARK_MODE;
                    var settings = {};
                    settings[darkMode] = false;
                    settings[autoDark] = true;
                    localStorageService.set(settingsKey, settings);
                }else {
                    $rootScope.$broadcast(SETTINGS_EVENTS.SETTINGS_CHANGED);
                }

                return settings;
            }

            settings = _initSettings();

            $rootScope.$on('LocalStorageModule.notification.setitem', function(event, data){
                if(data.key === settingsKey) {
                    settings = localStorageService.get(settingsKey);
                    if(settings) {
                        $rootScope.$broadcast(SETTINGS_EVENTS.SETTINGS_CHANGED);
                    }
                }
            });

            $rootScope.$on('ws.user.login', function(){
                _initSettings();
            });

            $rootScope.$on('ws.user.logout', function(){
               _initSettings();
            });

            this.get = function(key) {
                return localStorageService.get(settingsKey)[key];
            }

            this.set = function(key, value) {
                settings[key] = value;
                localStorageService.set(settingsKey, settings);
                return this;
            }

            this.getSettingsKey = function() {
                return settingsKey;   
            }

            this.bind = function(scope) {
                return localStorageService.bind(scope, settingsKey);
            };
        });
})();