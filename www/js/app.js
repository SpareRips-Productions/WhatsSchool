(function(){

'use strict';

angular.module('ws.app', ['ionic', 'ngCordova', 'LocalStorageModule', 'ui.gravatar', 'ws.group', 'ws.announcement', 'ws.user', 'ws.settings'])
    .config(["$ionicConfigProvider", function($ionicConfigProvider) {
      $ionicConfigProvider.platform.android.backButton.icon('ion-ios7-arrow-back');
    }])
    .run(["$ionicPlatform", "$cordovaStatusbar", function($ionicPlatform, $cordovaStatusbar) {
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
    }]);

})();
(function(){
    'use strict';

    angular.module('ws.announcement', ['ionic', 'ws.user']);
})();
(function() {
    'use strict';

    angular.module('ws.group', ['ionic', 'ws.announcement', 'ws.user']);
})();
(function(){
    'use strict';

    angular.module('ws.settings', ['ionic', 'ui.gravatar', 'ws.user'])
        .run(["$rootScope", "$timeout", "Theme", "SETTINGS_EVENTS", function($rootScope, $timeout, Theme, SETTINGS_EVENTS){
            $rootScope.$broadcast(SETTINGS_EVENTS.CHECK_THEME);
        }])
    ;
})();
(function(){
    'use strict';
    angular.module('ws.user', ['ionic', 'LocalStorageModule']);
})();
(function(){
    'use strict';

    angular.module('ws.app')
        .config(["$stateProvider", "$urlRouterProvider", "USER_ROLES", function($stateProvider, $urlRouterProvider, USER_ROLES) {
            $stateProvider
                .state('tabs', {
                    url: '/tabs',
                    abstract: true,
                    templateUrl: 'templates/tabs.html',
                    data: {
                        authorizedRoles: [USER_ROLES.student, USER_ROLES.admin]
                    }
                })
                .state('tabs.groups', {
                    url: '/groups',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/group/list.html',
                            controller: 'GroupListCtrl as ctrl'
                        }
                    }
                    
                })
                .state('tabs.groups-announcement', {
                    url: '/groups/:groupId/announcement/:announcementId',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/announcement/detail.html',
                            controller: 'AnnouncementDetailCtrl as ctrl'
                        }
                    }
                    
                })
                .state('tabs.groups-detail', {
                    url: '/groups/:id',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/group/detail.html',
                            controller: 'GroupDetailCtrl as ctrl'
                        }
                    }
                    
                })
                .state('tabs.groups-members', {
                    url: '/groups/:id/members',
                    views: {
                        'tab-groups': {
                            templateUrl: 'templates/group/members.html',
                            controller: 'GroupMembersCtrl as ctrl'
                        }
                    }
                })
                .state('tabs.settings', {
                    url: '/settings',
                    views: {
                        'tab-settings': {
                            templateUrl: 'templates/settings.html',
                            controller: 'SettingsCtrl as ctrl'
                        }
                    }
                })
                .state('welcome', {
                    url: '/welcome',
                    templateUrl: 'templates/welcome.html',
                    controller: 'WelcomeCtrl as ctrl'
                })
            ;
            
            $urlRouterProvider.otherwise( function($injector, $location) {
                var $state = $injector.get('$state');
                $state.go('welcome');
            });
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.app').config(["gravatarServiceProvider", function(gravatarServiceProvider){
        gravatarServiceProvider.defaults = {
          size     : 80,
          default: 'mm'  // Mystery man as default for missing avatars
        };

        // Use https endpoint
        gravatarServiceProvider.secure = true;

        // Force protocol
        gravatarServiceProvider.protocol = 'https';
    }]);
})();
(function(){
    'use strict';
    angular.module('ws.user')
        .run(["$rootScope", "$state", "Auth", "AUTH_EVENTS", function ($rootScope, $state, Auth, AUTH_EVENTS) {
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = (next.data && next.data.authorizedRoles) ? next.data.authorizedRoles : null;
                if (authorizedRoles && !Auth.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (!Auth.isAuthenticated()) {
                        $state.go('welcome');
                        return;
                    }
                }
                if(next.name === 'welcome' && Auth.isAuthenticated()) {
                    event.preventDefault();
                    $state.go('tabs.groups');
                    return;
                } 

            });
        }]);
})();
(function(){
    'use strict';
    angular.module('ws.announcement')
        .constant('ANNOUNCEMENT_TYPES', {
            calendar: {name: 'Calendar', logo:'ion-calendar'},
            clock: {name: 'Time', logo:'ion-clock'},
            coffee: {name: 'Coffee', logo:'ion-coffee'} 
        });
})();
(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AddAnnouncementCtrl', ["$scope", "$ionicPopup", "ANNOUNCEMENT_TYPES", "AnnouncementService", function($scope, $ionicPopup, ANNOUNCEMENT_TYPES, AnnouncementService){
            var vm = this;
            function _reset() {
                vm.announcement = {
                    name: '',
                    description: '',
                    logo: ANNOUNCEMENT_TYPES.calendar.logo,
                    group: $scope.group
                };
                vm.title = 'new Announcement';
            }
            _reset();

            this.add = function(){
                this.title = 'Please wait...';
                AnnouncementService.newAnnouncement(vm.Announcement).then(function(Announcement) {
                    _reset();
                    if($scope.addAnnouncementModal) {
                        $scope.addAnnouncementModal.hide();
                    }
                }, function (error) {
                    self.title = 'new Announcement';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.types = ANNOUNCEMENT_TYPES;

            this.cancel = function() {
                if($scope.addAnnouncementModal) {
                    $scope.addAnnouncementModal.hide();
                }
            };


        }]);
})();
(function(){
    'use strict';

    angular.module('ws.announcement')
        .controller('AnnouncementDetailCtrl', ["$stateParams", "$ionicScrollDelegate", "$ionicActionSheet", "$ionicHistory", "GroupService", "AnnouncementService", "UserSession", function($stateParams, $ionicScrollDelegate, $ionicActionSheet, $ionicHistory, GroupService, AnnouncementService, UserSession){
            var vm = this;
            this.announcement = {};
            this.group = {};

            this.newComment = '';
            var user = UserSession.getUser();

            

            function _reload() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementById($stateParams.id).then(function(announcement){
                    vm.announcement = announcement;
                    $ionicScrollDelegate.scrollBottom();
                });
            }

            this.edit = function(){
                var editSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Edit Announcement',
                    cancelText: 'Cancel',
                    destructiveButtonClicked: function(){
                        AnnouncementService.deleteAnnouncement(vm.announcement).then(function(){
                            editSheet();
                            $ionicHistory.goBack();
                        }, function(){
                            editSheet();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });
            };

            this.isCurrentUserComment = function(comment) {
                return comment.user.id === user.id;
            };

            this.sendNewComment = function() {
                var comment = {user: user, content: this.newComment};
                if(this.announcement.comments) {
                    this.announcement.comments.push(comment);
                    this.newComment = '';
                }
                $ionicScrollDelegate.scrollBottom();
            };

            _reload();

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.announcement')
        .factory('AnnouncementService', ["$q", "$timeout", "UserSession", function($q, $timeout, UserSession){

            var user = UserSession.user;

            function getAnnouncementsByGroupId(groupId) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var announcements = [
                        {
                            id: 1,
                            logo: 'ion-calendar',
                            name: 'Announcement 1'
                        },
                        {
                            id: 2,
                            logo: 'ion-clock',
                            name: 'Announcement 2'
                        },
                        {
                            id: 3,
                            logo: 'ion-coffee',
                            name: 'Announcement 3'
                        }
                    ];
                    deferred.resolve(announcements);
                }, 1000);
                return deferred.promise;
            }

            function getAnnouncementById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var announcement ={
                        id: 1,
                        groupId: 1,
                        logo: 'ion-calendar',
                        name: 'Announcement 1',
                        description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys' + 
                        'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make' +
                        'a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining' +
                        'essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum' +
                        'passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                        comments: [
                            {
                                content: 'Cool',
                                user: { id: 4, firstName: 'John', lastName: 'Doe'}
                            },
                            {
                                content: 'Awesome!!!',
                                user: { id: 4, firstName: 'John', lastName: 'Doe'}
                            }, 
                            {
                                content: 'Super',
                                user: { id: 4, firstName: 'John', lastName: 'Doe'}
                            },                        
                            {
                                content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys' + 
                        'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make' +
                        'a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining' +
                        'essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum' +
                        'passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                                user: { id: 4, firstName: 'John', lastName: 'Doe'}
                            },
                            {
                                content: 'Shiiit!',
                                user: { id: 1, firstName: 'Thomas', lastName: 'Hampe'}
                            },     
                        ]            
                    };

                    deferred.resolve(announcement);    
                }, 1000);
                return deferred.promise;
            }

            function newAnnouncement(announcement){
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    deferred.resolve(announcement);
                },1000);
                return deferred.promise;
            }

            function deleteAnnouncement(announcement){
                var deferred = $q.defer();
                $timeout(function(){
                    deferred.resolve(announcement);
                },1000);
                return deferred.promise;   
            }

            return {
                getAnnouncementsByGroupId: getAnnouncementsByGroupId,
                getAnnouncementById: getAnnouncementById,
                newAnnouncement: newAnnouncement,
                deleteAnnouncement: deleteAnnouncement
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddGroupCtrl', ["$scope", "$ionicPopup", "GroupService", "UserSession", function($scope, $ionicPopup, GroupService, UserSession){
            var vm = this;
            function _reset() {
                vm.group = {
                    name: '',
                    owner: UserSession.getUser()
                };
                vm.title = 'new Group';
            }
            _reset();

            this.add = function(){
                this.title = 'Please wait...';
                GroupService.newGroup(vm.group).then(function(group) {
                    _reset();
                    if($scope.addGroupModal) {
                        $scope.addGroupModal.hide();
                    }
                }, function (error) {
                    self.title = 'new Group';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.cancel = function() {
                if($scope.addGroupModal) {
                    $scope.addGroupModal.hide();
                }
            };


        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupDetailCtrl', ["$scope", "$stateParams", "$ionicActionSheet", "$ionicHistory", "$ionicPopup", "$ionicModal", "$ionicListDelegate", "GroupService", "AnnouncementService", "UserService", function(
                $scope, 
                $stateParams, 
                $ionicActionSheet, 
                $ionicHistory, 
                $ionicPopup, 
                $ionicModal, 
                $ionicListDelegate, 
                GroupService, 
                AnnouncementService, 
                UserService
            ){
            var vm = this;
            this.group = {};

            this.members = [];

            this.announcements = [];

            this.getMemberNames = function() {
                var members = [];
                for(var i = 0; i < this.members.length; i += 1) {
                    members.push(this.members[i].firstName + ' ' + this.members[i].lastName);
                }
                return members;
            };

            this.delete = function(){
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Are you sure?',
                    cancelText: 'Cancel',
                    destructiveButtonClicked: function(){
                        GroupService.deleteGroup(vm.group).then(function(){
                            deleteSheet();
                            $ionicHistory.goBack();
                        }, function(){
                            deleteSheet();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });
            };

            this.edit = function(){
                var editSheet = $ionicActionSheet.show({
                    buttons: [
                       { text: 'Add <strong>Announcement</strong> ' }
                    ],
                    destructiveText: 'Delete',
                    titleText: 'Edit Group',
                    cancelText: 'Cancel',
                    destructiveButtonClicked: function(){
                        editSheet();
                        vm.delete();
                    },
                    buttonClicked: function(index) {
                        if(index == 0) {
                            vm.addAnnouncement();
                        }
                        return true;
                    }
                });
            };


            $ionicModal.fromTemplateUrl('templates/announcement/add.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addAnnouncementModal = modal;
            });

            this.addAnnouncement = function(){
                if($scope.addAnnouncementModal) {
                    $scope.addAnnouncementModal.show();
                } 
            }

            this.deleteAnnouncement = function(announcement) {
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Delete ' + announcement.name + ', are you sure?',
                    cancelText: 'Cancel',
                    cancel: function(){
                        $ionicListDelegate.closeOptionButtons();
                    },
                    destructiveButtonClicked: function(){
                        AnnouncementService.deleteAnnouncement(announcement).then(function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                        }, function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });

                return true;
            }
            

            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                    $scope.group = group;
                });
                AnnouncementService.getAnnouncementsByGroupId($stateParams.id).then(function(announcements){
                    vm.announcements = announcements;
                });
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }
            _reload();

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupListCtrl', ["$scope", "$ionicModal", "$ionicActionSheet", "$ionicPopup", "$ionicListDelegate", "GroupService", "UserSession", function($scope, $ionicModal, $ionicActionSheet, $ionicPopup, $ionicListDelegate, GroupService, UserSession){
            var vm = this;
            this.groups = [];
            this.openAddGroupModal = function(){
                if($scope.addGroupModal) {
                    $scope.addGroupModal.show();
                }                
            };
            $ionicModal.fromTemplateUrl('templates/group/add.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addGroupModal = modal;
            });

            this.openSettingsModal = function(){
                if($scope.settingsModal) {
                    $scope.settingsModal.show();
                }                
            };
            $ionicModal.fromTemplateUrl('templates/settings.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.settingsModal = modal;
            });

            this.canDelete = function(group) {
                return UserSession.getUser().id == group.owner.id;
            }

            this.delete = function(group){
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Delete',
                    titleText: 'Delete ' + group.name +', are you sure?',
                    cancelText: 'Cancel',
                    cancel: function(){
                        $ionicListDelegate.closeOptionButtons();
                    },
                    destructiveButtonClicked: function(){
                        GroupService.deleteGroup(group).then(function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                        }, function(){
                            deleteSheet();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });
            };

            function _reload() {
                GroupService.getGroups().then(function(groups){
                    vm.groups = groups;
                });
            }
            _reload();
        }])
    ;
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupMembersCtrl', ["$scope", "$stateParams", "$ionicActionSheet", "$ionicListDelegate", "$ionicModal", "$ionicPopup", "GroupService", "UserService", "UserSession", function($scope, $stateParams, $ionicActionSheet, $ionicListDelegate, $ionicModal, $ionicPopup, GroupService, UserService, UserSession){
            var vm = this;
            var currentUser = UserSession.getUser();
            this.group = {};
            this.memebrs = [];

            this.isLoggedIn = function(user){
                return user.id === currentUser.id;
            }

            this.canDelete = function(user){
                return !this.isLoggedIn(user) && this.group.owner.id == currentUser.id;
            }

            this.delete = function(user){
                var deleteSheet = $ionicActionSheet.show({
                    destructiveText: 'Remove',
                    titleText: 'Remove <strong>' + user.firstName + ' ' + user.lastName + '</strong> from this Group?',
                    cancelText: 'Cancel',
                    cancel: function(){
                        $ionicListDelegate.closeOptionButtons();
                    },
                    destructiveButtonClicked: function(){
                        UserService.deleteUserFromGroup(user, vm.group.id).then(function(){
                            deleteSheet();
                            $ionicListDelegate.closeOptionButtons();
                        }, function(){
                            deleteSheet();
                            $ionicPopup.alert({
                                title: 'Ooops :(',
                                template: error.message || 'Please try again later...'
                            });
                        });
                    }
                });
            };

            $ionicModal.fromTemplateUrl('templates/group/members/add.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.addMembersModal = modal;
            });

            this.addMembers = function(){
                if($scope.addMembersModal) {
                    $scope.addMembersModal.show();
                } 
            }


            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

            _reload();
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .factory('GroupService', ["$q", "$timeout", "UserSession", "UserService", "USER_ROLES", function($q, $timeout, UserSession, UserService, USER_ROLES){
            var user = UserSession.user;

            function getGroups() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var groups = [
                        {
                            id: 1,
                            name: 'Group 1',
                            owner: {
                                id: 2,
                                firstName: 'Admini', 
                                lastName: 'Stratore', 
                                username: 'admin',
                                email: 'admin@hampe.co', 
                                role: USER_ROLES.admin
                            }
                        },
                        {
                            id: 1,
                            name: 'Group 2',
                            owner: {
                                id: 2,
                                firstName: 'Admini', 
                                lastName: 'Stratore', 
                                username: 'admin',
                                email: 'admin@hampe.co', 
                                role: USER_ROLES.admin
                            }
                        }
                    ];
                    deferred.resolve(groups);
                }, 1000);
                return deferred.promise;
            }

            function getGroupById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var group = {
                        id: 1, 
                        name: 'Group 1', 
                        owner: {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        },
                        announcements: [
                            {
                                id: 1,
                                logo: 'ion-calendar',
                                name: 'Announcement 1'
                            },
                            {
                                id: 2,
                                logo: 'ion-clock',
                                name: 'Announcement 2'
                            },
                            {
                                id: 3,
                                logo: 'ion-coffee',
                                name: 'Announcement 3'
                            }
                        ],
                        members: [
                            {name: 'John Doe'}, 
                            {name: 'Jane Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}, 
                            {name: 'John Doe'}
                        ]
                    };

                    deferred.resolve(group);    
                }, 1000);
                return deferred.promise;
            }

            function newGroup(group) {
                var deferred = $q.defer();
                $timeout(function(){
                    group.id = 3;

                    //after creation add current user to group
                    UserService.addUserToGroup(UserSession.getUser(), group.id).then(function(){
                        getGroupById(group.id).then(function(group){
                            deferred.resolve(group)
                        });
                    }, function(error){
                        deferred.reject(error);
                    });
                    
                }, 1000);

                return deferred.promise;
            }

            function deleteGroup(group) {
                var deferred = $q.defer();
                $timeout(function(){
                    deferred.resolve(group);
                }, 1000);

                return deferred.promise;
            }

            return {
                getGroups: getGroups,
                getGroupById: getGroupById,
                newGroup: newGroup,
                deleteGroup: deleteGroup
            };

        }])
    ;
})();
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
(function(){
    'use strict';

    angular.module('ws.settings')
        .controller('SettingsCtrl', ["$scope", "$state", "Auth", "UserSession", "WsSettings", "SETTINGS", function($scope, $state, Auth, UserSession, WsSettings,SETTINGS){
            var vm = this;
            var unBindSettings;
            var unBindUser;            
            $scope.SETTINGS = SETTINGS;

            function _unBind() {
                if(unBindSettings) {
                    unBindSettings();
                    unBindSettings = null;
                }
                if(unBindUser) {
                    unBindUser();
                    unBindUser = null;
                }
            }

            function _bind() {

                unBindSettings = WsSettings.bind($scope);
                unBindUser = UserSession.bindUser($scope);
                $scope.settings = $scope[WsSettings.getSettingsKey()];
            }            

            this.logout = function() {
                Auth.logout();
                vm.done();
                $state.go('welcome');
                
            };
            this.done = function() {
                if($scope.settingsModal) {
                    $scope.settingsModal.hide();
                }
            };

            // Execute action on hide modal
            $scope.$on('modal.hidden', _unBind);
            // Execute action on remove modal
            $scope.$on('modal.removed', _unBind);
            // Execute action on show modal
            $scope.$on('modal.shown', _bind);

            $scope.$on('$destroy', function() {
                if($scope.settingsModal) {
                    $scope.settingsModal.remove();
                }
            });


        }]);
})();
(function(){
    'use strict';

    angular.module('ws.settings')
        .service('WsSettings', ["$rootScope", "localStorageService", "UserSession", "SETTINGS", "SETTINGS_EVENTS", function($rootScope, localStorageService, UserSession, SETTINGS, SETTINGS_EVENTS){
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
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.settings')
        .factory('Theme', ["$document", "$rootScope", "WsSettings", "SETTINGS", "THEMES", "SETTINGS_EVENTS", function($document, $rootScope, WsSettings, SETTINGS, THEMES, SETTINGS_EVENTS){
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

        }]);
})();
(function(){
    'use strict';
    angular.module('ws.user')
        .constant('AUTH_EVENTS', {
            loginSuccess:           'auth-login-success',
            loginFailed:            'auth-login-failed',
            logoutSuccess:          'auth-logout-success',
            sessionTimeout:         'auth-session-timeout',
            notAuthenticated:       'auth-not-authenticated',
            notAuthorized:          'auth-not-authorized'
        });
})();
(function(){
    'use strict';

    angular.module('ws.user')
        .constant('USER_ROLES', {
            all:        '*',
            admin:      'admin',
            teacher:    'teacher',
            student:    'student',
        });
})();
(function(){
    'use strict';

    angular.module('ws.user')
        .controller('AclCtrl', ["$rootScope", "Auth", "USER_ROLES", function($rootScope, Auth, USER_ROLES){
            var vm = this;

            vm.isAuthorized = function(groups) {
                return Auth.isAuthorized(groups);
            };

            vm.isAdmin = function() {
                return Auth.isAuthorized([USER_ROLES.admin]);
            };

            vm.isTeacher = function() {
                return Auth.isAuthorized([USER_ROLES.teacher, USER_ROLES.admin])
            };

            vm.isStudent = function() {
                return Auth.isAuthorized(USER_ROLES.student, USER_ROLES.teacher, USER_ROLES.admin);
            };
            vm.USER_ROLES = USER_ROLES;
        }]);
})();
(function(){
    'use strict';
    angular.module('ws.user')
        .controller('LoginCtrl', ["$rootScope", "$scope", "$ionicPopup", "AUTH_EVENTS", "Auth", function LoginCtrl($rootScope, $scope, $ionicPopup, AUTH_EVENTS, Auth){
            this.credentials = {
                username: '',
                password: ''
            };
            this.title = 'Login';
            var self = this;
            this.login = function(){
                this.title = 'Please wait...';
                Auth.login(this.credentials).then(function(user) {
                    self.title = 'Login';
                    self.credentials = {
                        username: '',
                        password: ''
                    };
                    if($scope.loginModal) {
                        $scope.loginModal.hide();
                    }
                }, function (error) {
                    self.title = 'Login';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.cancel = function() {
                if($scope.loginModal) {
                    $scope.loginModal.hide();
                }
            };

        }]);
})();
(function(){
    'use strict';
    angular.module('ws.user')
        .controller('RegisterCtrl', ["$rootScope", "$scope", "$ionicPopup", "AUTH_EVENTS", "Auth", function LoginCtrl($rootScope, $scope, $ionicPopup, AUTH_EVENTS, Auth){
            this.credentials = {};
            this.title = '';
            var self = this;
            this.register = function(){
                this.title = 'Please wait...';
                Auth.register(this.credentials).then(function(user) {
                    _init();
                    if($scope.registerModal) {
                        $scope.registerModal.hide();
                    }
                }, function (error) {
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });
            };

            this.cancel = function() {
                if($scope.registerModal) {
                    $scope.registerModal.hide();
                }
            };

            function _init(){
                self.credentials = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    username: '',
                    password: ''
                };
                self.title = 'Register';
            }
            _init();

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.user')
        .controller('WelcomeCtrl', ["$scope", "$state", "$ionicModal", "Auth", function($scope, $state, $ionicModal, Auth){
            this.openLogin = function(){
                $scope.loginModal.show();
            };
            this.openRegister = function(){
                $scope.registerModal.show();
            };
            //Login
            $ionicModal.fromTemplateUrl('templates/user/login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.loginModal = modal;
            });

            //Register
            $ionicModal.fromTemplateUrl('templates/user/register.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.registerModal = modal;
            });

            $scope.$on('$destroy', function() {
                $scope.loginModal.remove();
                $scope.registerModal.remove();
            });



            // Execute action on hide modal
            $scope.$on('modal.hidden', function() {
                if(Auth.isAuthenticated()) {
                    $state.go('tabs.groups');
                }
            });
            // Execute action on remove modal
            $scope.$on('loginModal.removed', function() {
            // Execute action
            });

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.user')
        .factory('Auth', ["$rootScope", "$http", "$q", "$timeout", "$ionicHistory", "UserSession", "USER_ROLES", function ($rootScope, $http, $q, $timeout, $ionicHistory, UserSession, USER_ROLES) {
            var authService = {};

            authService.login = function (credentials) {
                //TODO: Implement Login Api
                var deferred = $q.defer();

                $timeout(function(){
                    var user;
                    if(credentials.username === 'thomas') {
                        user = {
                            id: 1,
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        };
                        UserSession.create(user);
                        deferred.resolve(user);
                    } else if(credentials.username === 'admin') {
                        user = {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        };
                        UserSession.create(user);
                        deferred.resolve(user);
                    } else {
                        deferred.reject({ message: 'Username or Password invalid' });
                    }
                }, 300);

                deferred.promise.then(function(user){
                    $rootScope.$broadcast('ws.user.login', user);
                });

                return deferred.promise;
            };

            authService.register = function(credentials) {
                var deferred = $q.defer();
                //TODO: Login API
                return this.login(credentials);
            };

            authService.logout = function(){
                $ionicHistory.clearCache();
                var result = UserSession.destroy()
                $rootScope.$broadcast('ws.user.logout');
                return result;
            };

            authService.isAuthenticated = function () {
                return !!UserSession.getUser().username;
            };

            authService.isAuthorized = function (authorizedRoles) {
                if (!angular.isArray(authorizedRoles)) {
                  authorizedRoles = [authorizedRoles];
                }
                return (authService.isAuthenticated() && authorizedRoles.indexOf(UserSession.getUser().role) !== -1);
            };

            return authService;
        }]);
})();
(function(){
    'use strict';

     angular.module('ws.group')
        .factory('UserService', ["$q", "$timeout", "UserSession", "USER_ROLES", function($q, $timeout, UserSession, USER_ROLES){

            var user = UserSession.user;

            function getUsers() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var users = [
                        {
                            id: 1,
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        },
                        {
                            id: 3,
                            firstName: 'Thomas 5', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 4,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 5,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 6,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 7,
                            firstName: 'Thomas 4', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        }
                    ];
                    deferred.resolve(users);
                }, 1000);
                return deferred.promise;
            }

            function getUsersByGroupId(groupId) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var users = [
                        {
                            id: 1,
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            id: 2,
                            firstName: 'Admini', 
                            lastName: 'Stratore', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        }
                    ];
                    deferred.resolve(users);
                }, 1000);
                return deferred.promise;
            }

            function getUserById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var user = {
                        id: 3,
                        firstName: 'Thomas', 
                        lastName: 'Hampe',     
                        username: 'thomas',
                        email: 'thomas@hampe.co', 
                        role: USER_ROLES.student
                    };

                    deferred.resolve(user);    
                }, 1000);
                return deferred.promise;
            }

            function deleteUserFromGroup(user, groupId) {
                var userId = (angular.isObject(user)) ? user.id : user;
                var deferred = $q.defer();
                $timeout(function(){
                    return deferred.resolve(true);
                }, 1000);
                return deferred.promise;
            }

            function addUserToGroup(user, groupId) {
                var deferred = $q.defer();
                $timeout(function(){
                    return deferred.resolve(true);
                }, 1000);
                return deferred.promise;
            }

            return {
                getUsers: getUsers,
                getUsersByGroupId: getUsersByGroupId,
                getUserById: getUserById,
                deleteUserFromGroup: deleteUserFromGroup,
                addUserToGroup: addUserToGroup
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.user')
        .service('UserSession', ["$rootScope", "localStorageService", function($rootScope, localStorageService){
            var _userProps = ['firstName', 'lastName', 'email', 'username', 'role'];
            var user;
            this.getUser = function() {
                if(user === undefined) {
                    user = localStorageService.get('user') || {};
                }
                return user;
            };

            $rootScope.$on('LocalStorageModule.notification.setitem', function(event, data){
                if(data.key === 'user') {
                    user = localStorageService.get('user');
                }
            });


            this.bindUser = function(scope) {
                return localStorageService.bind(scope, 'user');
            }

            this.create = function (user) {
                this.destroy();
                localStorageService.set('user', user);
                return this.getUser();
            };
            this.destroy = function () {
                user = undefined;
                localStorageService.set('user', {});
            };
            return this;
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddMembersCtrl', ["$scope", "$q", "$stateParams", "$ionicPopup", "UserService", "GroupService", function($scope, $q, $stateParams, $ionicPopup, UserService, GroupService){
            var vm = this;
            vm.group = {};
            vm.members = [];
            vm.users = [];

            function _reset() {
                vm.title = 'add Members';
            }
            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                $q.all([UserService.getUsers(), UserService.getUsersByGroupId()]).then(function(results){
                    vm.users = results[0];
                    vm.members = results[1];
                    var isInGroup = {};
                    for(var i in vm.members) {
                        isInGroup[vm.members[i].id] = true;
                    }

                    angular.forEach(vm.users, function(user, key){
                        vm.users[key].isInGroup = !!isInGroup[user.id];
                        vm.users[key].wasInGroup = !!isInGroup[user.id];

                    })
                });
            }

            _reset();
            _reload();

            this.add = function(){
                this.title = 'Please wait...';
                var usersAddToGroup = []
                var user;
                for(var i = 0; i < vm.users.length; i++) {
                    user = vm.users[i];
                    if(user.isInGroup && !user.wasInGroup){
                        usersAddToGroup.push(UserService.addUserToGroup(user, vm.group.id));
                    }
                }
                $q.all(usersAddToGroup).then(function(){
                    _reset();
                    if($scope.addMembersModal) {
                        $scope.addMembersModal.hide();
                    }
                }, function(error){
                    self.title = 'add Members';
                    $ionicPopup.alert({
                        title: 'Ooops :(',
                        template: error.message || 'Please try again later...'
                    });
                });

            };

            this.cancel = function() {
                if($scope.addMembersModal) {
                    $scope.addMembersModal.hide();
                }
            };

            


        }]);
})();