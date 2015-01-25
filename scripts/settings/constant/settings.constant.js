(function(){
    angular.module('ws.settings')
        .constant('SETTINGS', {
            DARK_MODE: 'darkMode',
            AUTO_DARK_MODE: 'autoDarkMode'
        })
        .constant('THEMES', {
            DARK: 'dark-mode',
            LIGHT: 'light-mode'
        })
        .constant('SETTINGS_EVENTS', {
            'SETTINGS_CHANGED': 'settings-changed',
            'CHECK_THEME': 'check_theme'
        });
})();