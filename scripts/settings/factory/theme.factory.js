(function(){
    'use strict';

    angular.module('ws.settings')
        .factory('Theme', function($document, $rootScope, WsSettings, SETTINGS, THEMES, SETTINGS_EVENTS){
            var self = this;
            this.checkTheme = function() {
                var body = angular.element($document[0].body);
                var theme = self.getThemeClass();
                if(!body.hasClass(theme)){
                    body.removeClass(THEMES.LIGHT);
                    body.removeClass(THEMES.DARK);
                    body.addClass(theme);
                }
            }

            this.getThemeClass = function() {
                var isDarkMode = WsSettings.get(SETTINGS.DARK_MODE);
                //check if auto dark mode
                if(!isDarkMode) {

                }

                return (isDarkMode) ? THEMES.DARK : THEMES.LIGHT;
            }

            $rootScope.$on(SETTINGS_EVENTS.SETTINGS_CHANGED, function(event, currentSettings){
                self.checkTheme();
            });

            $rootScope.$on(SETTINGS_EVENTS.CHECK_THEME, function(){
                self.checkTheme();
            });

            return this;

        });
})();