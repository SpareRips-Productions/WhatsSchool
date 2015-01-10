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

    angular.module('ws.settings', ['ionic', 'ui.gravatar', 'ws.user']);
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
                            templateUrl: 'templates/user/groupUsers.html',
                            controller: 'GroupMembersCtrl as ctrl'
                        }
                    }
                })
                .state('tabs.contacts', {
                    url: '/contacts',
                    views: {
                        'tab-contacts': {
                            templateUrl: 'templates/user/list.html'
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
                var $state = $injector.get("$state");
                $state.go("welcome");
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
        .controller('AnnouncementDetailCtrl', ["$stateParams", "$ionicScrollDelegate", "GroupService", "AnnouncementService", "UserSession", function($stateParams, $ionicScrollDelegate, GroupService, AnnouncementService, UserSession){
            var vm = this;
            this.announcement = {};
            this.group = {};

            this.newComment = "";
            var user = UserSession.getUser();

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementById($stateParams.id).then(function(announcement){
                    vm.announcement = announcement;
                    $ionicScrollDelegate.scrollBottom();
                });
            }

            this.isCurrentUserComment = function(comment) {
                return comment.user.id === user.id;
            }

            this.sendNewComment = function() {
                var comment = {user: user, content: this.newComment};
                if(this.announcement.comments) {
                    this.announcement.comments.push(comment);
                    this.newComment = "";
                }
                $ionicScrollDelegate.scrollBottom();
            }

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupDetailCtrl', ["$stateParams", "GroupService", "AnnouncementService", "UserService", function($stateParams, GroupService, AnnouncementService, UserService){
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

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                AnnouncementService.getAnnouncementsByGroupId($stateParams.id).then(function(announcements){
                    vm.announcements = announcements;
                });
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupListCtrl', ["GroupService", function(GroupService){
            var vm = this;
            this.groups = [];

            _reload();

            function _reload() {
                GroupService.getGroups().then(function(groups){
                    vm.groups = groups;
                });
            }
        }])
    ;
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupMembersCtrl', ["$stateParams", "GroupService", "UserService", function($stateParams, GroupService, UserService){
            var vm = this;
            this.group = {};
            this.memebrs = [];

            _reload();

            function _reload() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .factory('GroupService', ["$q", "$timeout", "UserSession", function($q, $timeout, UserSession){
            return {
                getGroups: getGroups,
                getGroupById: getGroupById
            };

            var user = UserSession.user;

            function getGroups() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var groups = [
                        {
                            id: 1,
                            name: 'Group 1',
                            owner: 'Owner'
                        },
                        {
                            id: 1,
                            name: 'Group 2',
                            owner: 'Owner 2'
                        }
                    ];
                    deferred.resolve(groups);
                }, 1000);
                return deferred.promise;
            };

            function getGroupById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var group = {
                        id: 1, 
                        name: 'Group 1', 
                        owner: 'Owner',
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
            };
        }])
    ;
})();
(function(){
    'use strict';

    angular.module('ws.announcement')
        .factory('AnnouncementService', ["$q", "$timeout", "UserSession", function($q, $timeout, UserSession){
            return {
                getAnnouncementsByGroupId: getAnnouncementsByGroupId,
                getAnnouncementById: getAnnouncementById
            };

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
            };

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
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            },
                            {
                                content: 'Awesome!!!',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            }, 
                            {
                                content: 'Super',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            },                        
                            {
                                content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys' + 
                        'standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make' +
                        'a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining' +
                        'essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum' +
                        'passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                                user: { id: 1, firstName: 'John', lastName: 'Doe'}
                            },
                            {
                                content: 'Shiiit!',
                                user: { id: 4, firstName: 'Thomas', lastName: 'Hampe'}
                            },     
                        ]            
                    };

                    deferred.resolve(announcement);    
                }, 1000);
                return deferred.promise;
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.settings')
        .controller('SettingsCtrl', ["$state", "Auth", "UserSession", function($state, Auth, UserSession){
            this.logout = function() {
                Auth.logout();
                $state.go('welcome');
            };
            this.user = UserSession.getUser();
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
            this.title = "";
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
            };
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
        .factory('Auth', ["$http", "$q", "$timeout", "$ionicHistory", "UserSession", "USER_ROLES", function ($http, $q, $timeout, $ionicHistory, UserSession, USER_ROLES) {
            var authService = {};

            authService.login = function (credentials) {
                //TODO: Implement Login Api
                var deferred = $q.defer();

                $timeout(function(){
                    var user;
                    if(credentials.username === 'thomas') {
                        user = {
                            id: 4,
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
                            id: 5,
                            firstName: 'Administratore', 
                            lastName: 'Admin', 
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

                return deferred.promise;
            };

            authService.register = function(credentials) {
                var deferred = $q.defer();
                //TODO: Login API
                return this.login(credentials);
            }

            authService.logout = function(){
                //$ionicHistory.clearCache()
                return UserSession.destroy();
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
            return {
                getUsers: getUsers,
                getUsersByGroupId: getUsersByGroupId,
                getUserById: getUserById
            };

            var user = UserSession.user;

            function getUsers() {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var users = [
                        {
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            firstName: 'Administratore', 
                            lastName: 'Admin', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        }
                    ];
                    deferred.resolve(users);
                }, 1000);
                return deferred.promise;
            };

            function getUsersByGroupId(groupId) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var users = [
                        {
                            firstName: 'Thomas', 
                            lastName: 'Hampe',     
                            username: 'thomas',
                            email: 'thomas@hampe.co', 
                            role: USER_ROLES.student
                        },
                        {
                            firstName: 'Administratore', 
                            lastName: 'Admin', 
                            username: 'admin',
                            email: 'admin@hampe.co', 
                            role: USER_ROLES.admin
                        }
                    ];
                    deferred.resolve(users);
                }, 1000);
                return deferred.promise;
            };

            function getUserById(id) {
                //TODO: Implement Real Api
                var deferred = $q.defer();
                $timeout(function(){
                    var user = {
                        firstName: 'Thomas', 
                        lastName: 'Hampe',     
                        username: 'thomas',
                        email: 'thomas@hampe.co', 
                        role: USER_ROLES.student
                    };

                    deferred.resolve(user);    
                }, 1000);
                return deferred.promise;
            };
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.user')
        .service('UserSession', ["localStorageService", function(localStorageService){
            var _userProps = ['firstName', 'lastName', 'email', 'username', 'role'];
            var user;
            this.getUser = function() {
                if(user === undefined) {
                    user = localStorageService.get('user') || {};
                }
                return user;
            };

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