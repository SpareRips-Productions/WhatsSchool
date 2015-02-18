(function(){

'use strict';

angular.module('ws.app', [
      'ionic', 
      'ngCordova', 
      'LocalStorageModule', 
      'ngSails',
      'ui.gravatar', 
      'ws.api',
      'ws.group', 
      'ws.announcement', 
      'ws.user', 
      'ws.settings',
      'ws.comment'
    ])
    .config(['$sailsProvider', function ($sailsProvider) {
            $sailsProvider.url = 'http://whatsschool.herokuapp.com:80';
    }])
    .config(function($ionicConfigProvider) {
      $ionicConfigProvider.platform.android.backButton.icon('ion-ios7-arrow-back');
    })
    .run(function($ionicPlatform, $cordovaStatusbar) {
          $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
              cordova.plugins.Keyboard.disableScroll(true);
            }
            if(window.StatusBar) {
              // org.apache.cordova.statusbar required
              $cordovaStatusbar.styleColor('white');
            }
        });
    });

})();