(function(){

'use strict';

angular.module('ws.app', ['ionic', 'LocalStorageModule', 'ui.gravatar', 'ws.group', 'ws.announcement', 'ws.user', 'ws.settings'])
    .config(function($ionicConfigProvider) {
      $ionicConfigProvider.platform.android.backButton.icon('ion-ios7-arrow-back');
      console.log($ionicConfigProvider.platform.android.tabs.style());
    })
    .run(function($ionicPlatform) {
          $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              // org.apache.cordova.statusbar required
              StatusBar.styleDefault();
            }
        });
    });

})();