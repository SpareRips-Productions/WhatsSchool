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
(function(){
    'use strict';
    angular.module('ws.api', ['ngSails']);
})();
(function() {
    'use strict';
    angular.module('ws.comment', ['ws.api']);
})();
(function() {
    'use strict';

    angular.module('ws.group', ['ionic', 'ngSails', 'ws.announcement', 'ws.user', 'ws.api']);
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
    angular.module('ws.user', ['ionic', 'LocalStorageModule', 'ws.api']);
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
                        authorizedRoles: [USER_ROLES.student, USER_ROLES.teacher, USER_ROLES.admin]
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
                            controller: 'GroupMembersCtrl as MembersCtrl'
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
;
})();
(function (angular, io) {
'use strict'/*global angular */
angular.module('ngSails', ['ng']);

/*jslint sloppy:true*/
/*global angular, io */
angular.module('ngSails').provider('$sails', function () {
    var provider = this,
        httpVerbs = ['get', 'post', 'put', 'delete'],
        eventNames = ['on', 'once'];

    this.url = undefined;
    this.interceptors = [];

    this.$get = ['$q', '$timeout', function ($q, $timeout) {
        var socket = io.sails.connect(provider.url),
            defer = function () {
                var deferred = $q.defer(),
                    promise = deferred.promise;

                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };

                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };

                return deferred;
            },
            resolveOrReject = function (deferred, data) {
                // Make sure what is passed is an object that has a status and if that status is no 2xx, reject.
                if (data && angular.isObject(data) && data.status && Math.floor(data.status / 100) !== 2) {
                    deferred.reject(data);
                } else {
                    deferred.resolve(data);
                }
            },
            angularify = function (cb, data) {
                $timeout(function () {
                    cb(data);
                });
            },
            promisify = function (methodName) {
                socket['legacy_' + methodName] = socket[methodName];
                socket[methodName] = function (url, data, cb) {
                    var deferred = defer();
                    if (cb === undefined && angular.isFunction(data)) {
                        cb = data;
                        data = null;
                    }
                    deferred.promise.then(cb);
                    socket['legacy_' + methodName](url, data, function (result) {
                        resolveOrReject(deferred, result);
                    });
                    return deferred.promise;
                };
            },
            wrapEvent = function (eventName) {
                socket['legacy_' + eventName] = socket[eventName];
                socket[eventName] = function (event, cb) {
                    if (cb !== null && angular.isFunction(cb)) {
                        socket['legacy_' + eventName](event, function (result) {
                            angularify(cb, result);
                        });
                    }
                };
            };

        angular.forEach(httpVerbs, promisify);
        angular.forEach(eventNames, wrapEvent);

        return socket;
    }];
});
}(angular, io));
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
        .controller('AddAnnouncementCtrl', ["$rootScope", "$scope", "$ionicPopup", "$stateParams", "ANNOUNCEMENT_TYPES", "AnnouncementService", "GroupService", "RELOAD", function($rootScope, $scope, $ionicPopup, $stateParams, ANNOUNCEMENT_TYPES, AnnouncementService, GroupService, RELOAD){
            var vm = this;
            function _reset() {
                vm.announcement = {
                    name: '',
                    description: '',
                    logo: ANNOUNCEMENT_TYPES.calendar.logo,
                    group: {} 
                };
                vm.title = 'new Announcement';
            };
            _reset();

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.announcement.group = group;
                });
            };
            _reloadGroup();
            $rootScope.$on(RELOAD.GROUP, _reloadGroup);

            this.add = function(){
                this.title = 'Please wait...';
                AnnouncementService.newAnnouncement(vm.announcement).then(function(announcement) {
                    _reset();
                    if($scope.addAnnouncementModal) {
                        $scope.addAnnouncementModal.hide();
                    }
                }, function (error) {
                    self.title = 'new Announcement';
                    console.log(error);
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
        .controller('AnnouncementDetailCtrl', ["$rootScope", "$stateParams", "$ionicScrollDelegate", "$ionicActionSheet", "$ionicHistory", "GroupService", "AnnouncementService", "UserSession", "CommentService", "RELOAD", function(
                $rootScope,
                $stateParams, 
                $ionicScrollDelegate, 
                $ionicActionSheet, 
                $ionicHistory, 
                GroupService, 
                AnnouncementService, 
                UserSession,
                CommentService,
                RELOAD
            ){
            var vm = this;
            this.announcement = {};
            this.group = {};
            this.comments = [];

            this.newComment = '';
            var user = UserSession.getUser();

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.groupId).then(function(group){
                    vm.group = group;
                });
            }

            function _reloadAnnouncement() {
                AnnouncementService.getAnnouncementById($stateParams.announcementId).then(function(announcement){
                    vm.announcement = announcement;
                    
                });
            }

            function _reloadComments() {
                CommentService.getCommentsByAnnouncementId($stateParams.announcementId).then(function(comments){
                    vm.comments = comments;
                    $ionicScrollDelegate.scrollBottom();
                });
                
            }

            function _reload() {
                _reloadGroup();
                _reloadAnnouncement();
                _reloadComments();
            }

            $rootScope.$on(RELOAD.GROUP, _reloadGroup);
            $rootScope.$on(RELOAD.ANNOUNCEMENT, _reloadAnnouncement);
            $rootScope.$on(RELOAD.COMMENT, function(message, payload){
                if(payload && payload.data && payload.data.announcement == vm.announcement.id) {
                    CommentService.getCommentsByAnnouncementId($stateParams.announcementId).then(function(comments){
                        vm.comments = comments;
                        $ionicScrollDelegate.scrollBottom();
                    });
                }
                
            });

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
                var comment = {user: user, text: this.newComment, announcement: this.announcement};
                CommentService.newComment(comment).then(function(newComment){
                    vm.newComment = '';
                });                
            };

            _reload();

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.announcement')
        .factory('AnnouncementService', ["$rootScope", "$sailsPromised", "RELOAD", function($rootScope, $sailsPromised, RELOAD){

            function getAnnouncementsByGroupId(groupId) {
                return $sailsPromised.get('/groups/'+groupId+'/announcements');   
            }

            function getAnnouncementById(id) {
                return $sailsPromised.get('/announcements/'+id);    
            }

            function newAnnouncement(announcement){
                return $sailsPromised.post('/announcements', announcement).then(function(newAnnouncement){
                    $rootScope.$broadcast(RELOAD.ANNOUNCEMENT, {verb: 'created', data: newAnnouncement});
                    return newAnnouncement;
                });
            }

            function deleteAnnouncement(announcement){
                return $sailsPromised.delete('/announcements/' + announcement.id).then(function(deletedAnnouncement){
                    $rootScope.$broadcast(RELOAD.ANNOUNCEMENT, {verb: 'deleted', data: deletedAnnouncement});
                    return deletedAnnouncement;
                });  
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
    angular.module('ws.api')
        .run(["$rootScope", "$sails", "RELOAD", "ENTITIES", function($rootScope, $sails, RELOAD, ENTITIES){
            $sails.on('connect', function(){
                angular.forEach(ENTITIES, function(entityName, entityId){
                    if(RELOAD[entityId]) {
                        $sails.on(entityName, function(message){
                            $rootScope.$broadcast(RELOAD[entityId], message);
                        });
                    }
                });
            });
        }]);
})();
(function(){
    'use strict';
    angular.module('ws.api')
        .constant('RELOAD', {
            ALL: 'reload_all',
            GROUP: 'reload_group',
            ANNOUNCEMENT: 'reload_announcement',
            USER: 'reload_user',
            COMMENT: 'reload_comment'
        })
        .constant('ENTITIES', {
            GROUP: 'groups',
            ANNOUNCEMENT: 'announcements',
            USER: 'users',
            COMMENT: 'comments'
        });
    ;
})();
(function(){
    'use strict';

    angular.module('ws.api')
        .factory('$sailsPromised', ["$sails", "$q", function($sails, $q){
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
        }])
})();
(function(){
    'use strict';

    (function(){
    'use strict';

    angular.module('ws.comment')
        .factory('CommentService', ["$rootScope", "$sailsPromised", "RELOAD", function($rootScope, $sailsPromised, RELOAD) {

            function newComment(comment) {
                return $sailsPromised.post('/comments', comment).then(function(newComment){
                    $rootScope.$broadcast(RELOAD.COMMENT, {verb: 'created', data: newComment});
                    return newComment;
                });
            };

            function getCommentsByAnnouncementId(announcementId) {
                return $sailsPromised.get('/comments', {announcement: announcementId, sort: 'createdAt'});
            };

            return {
                newComment: newComment,
                getCommentsByAnnouncementId: getCommentsByAnnouncementId
            };

        }])
    ;
})();
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('AddGroupCtrl', ["$q", "$scope", "$ionicPopup", "GroupService", "UserSession", "UserService", function($q, $scope, $ionicPopup, GroupService, UserSession, UserService){
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
                    
                    if($scope.addGroupModal) {
                        UserService
                            .addUserToGroup(UserSession.getUser(), group.id)
                            .then(function(){
                                _reset();
                                $scope.addGroupModal.hide();
                            }, function(error){
                                self.title = 'new Group';
                                $ionicPopup.alert({
                                    title: 'Ooops :(',
                                    template: error.message || 'Please try again later...'
                                });
                            });                        
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
        .controller('GroupDetailCtrl', ["$rootScope", "$scope", "$stateParams", "$ionicActionSheet", "$ionicHistory", "$ionicPopup", "$ionicModal", "$ionicListDelegate", "GroupService", "AnnouncementService", "UserService", "UserSession", "RELOAD", function(
                $rootScope,
                $scope, 
                $stateParams, 
                $ionicActionSheet, 
                $ionicHistory, 
                $ionicPopup, 
                $ionicModal, 
                $ionicListDelegate, 
                GroupService, 
                AnnouncementService, 
                UserService,
                UserSession,
                RELOAD
            ){
            var vm = this;
            this.group = {};
            $scope.group = {};

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

            this.canDelete = function() {
                return vm.isOwner();
            }

            this.isOwner = function() {
                return vm.group && vm.group.owner && UserSession.getUser().id === vm.group.owner.id;
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
            
            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                    $scope.group = group;
                });
            }

            function _reloadAnnouncements() {
                AnnouncementService.getAnnouncementsByGroupId($stateParams.id).then(function(announcements){
                    vm.announcements = announcements;
                });
            }

            function _reloadMembers() {
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

            (function _reload() {
                _reloadGroup();
                _reloadAnnouncements();
                _reloadMembers();                
            })();
            $rootScope.$on(RELOAD.GROUP, _reloadGroup);
            $rootScope.$on(RELOAD.ANNOUNCEMENT, _reloadAnnouncements);
            $rootScope.$on(RELOAD.USER, _reloadMembers);

        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupListCtrl', ["$rootScope", "$scope", "$ionicModal", "$ionicActionSheet", "$ionicPopup", "$ionicListDelegate", "$sails", "GroupService", "UserService", "UserSession", "RELOAD", function(
            $rootScope,
            $scope, 
            $ionicModal, 
            $ionicActionSheet, 
            $ionicPopup, 
            $ionicListDelegate, 
            $sails, 
            GroupService,
            UserService, 
            UserSession,
            RELOAD
        ){
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
                            $rootScope.$broadcast(RELOAD.GROUP, {verb: 'deleted', data: group});
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
            };
            _reload();
            $rootScope.$on(RELOAD.GROUP, _reload);
        }])
    ;
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .controller('GroupMembersCtrl', ["$rootScope", "$scope", "$stateParams", "$ionicActionSheet", "$ionicListDelegate", "$ionicModal", "$ionicPopup", "GroupService", "UserService", "UserSession", "RELOAD", function(
                $rootScope, 
                $scope, 
                $stateParams, 
                $ionicActionSheet, 
                $ionicListDelegate, 
                $ionicModal, 
                $ionicPopup, 
                GroupService, 
                UserService, 
                UserSession,
                RELOAD
            ){
            var vm = this;
            var currentUser = UserSession.getUser();
            this.group = {};
            this.members = [];

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

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
            }

            function _reloadMembers() {
                UserService.getUsersByGroupId($stateParams.id).then(function(members){
                    vm.members = members;
                });
            }

            function _reload() {
                _reloadGroup();
                _reloadMembers();
            }
            _reload();

            $rootScope.$on(RELOAD.GROUP, _reloadGroup);
            $rootScope.$on(RELOAD.USER, _reloadMembers);
        }]);
})();
(function(){
    'use strict';

    angular.module('ws.group')
        .factory('GroupService', ["$rootScope", "$sailsPromised", "RELOAD", function($rootScope, $sailsPromised,RELOAD) {

            function getGroups() {
                return $sailsPromised.get("/groups");
            }

            function getGroupById(id) {
                return $sailsPromised.get("/groups/"+id);
            }

            function newGroup(group) {
                return $sailsPromised.post('/groups', group).then(function(createdGroup){
                    $rootScope.$broadcast(RELOAD.GROUP,{verb: 'created', data: createdGroup});
                    return createdGroup;
                });
            }

            function deleteGroup(group) {
                return $sailsPromised.delete('/groups/'+group.id).then(function(deletedGroup){
                    $rootScope.$broadcast(RELOAD.GROUP,{verb: 'deleted', data: deletedGroup});
                    return deletedGroup;
                });
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
                email: '',
                password: ''
            };
            this.title = 'Login';
            var self = this;
            this.login = function(){
                this.title = 'Please wait...';
                Auth.login(this.credentials).then(function(user) {
                    self.title = 'Login';
                    self.credentials = {
                        email: '',
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
        .controller('RegisterCtrl', ["$rootScope", "$scope", "$ionicPopup", "AUTH_EVENTS", "Auth", "USER_ROLES", function LoginCtrl($rootScope, $scope, $ionicPopup, AUTH_EVENTS, Auth, USER_ROLES){
            this.credentials = {};
            this.title = '';
            this.roles = USER_ROLES;
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
                    password: '',
                    role: 'student'
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
        .factory('Auth', ["$rootScope", "$http", "$q", "$timeout", "$sailsPromised", "$ionicHistory", "UserSession", "UserService", "USER_ROLES", function ($rootScope, $http, $q, $timeout, $sailsPromised, $ionicHistory, UserSession, UserService, USER_ROLES) {
            var authService = {};

            authService.login = function (credentials) {
                //TODO: Implement Login Authenticate
                var deferred = $q.defer();
                $sailsPromised.get('/users', {email: credentials.email}).then(function(users){
                    if(users.length === 0) {
                        deferred.reject({message: 'No User found...'});
                    }else {
                        var user = users[0];
                        UserSession.create(user);
                        deferred.resolve(user);
                    }
                }, function(error){
                    deferred.reject(error);
                })

                deferred.promise.then(function(user){
                    $rootScope.$broadcast('ws.user.login', user);
                });

                return deferred.promise;
            };

            authService.register = function(credentials) {
                var deferred = $q.defer();
                UserService.newUser(credentials).then(function(){
                    authService.login({email: credentials.email, password: credentials.password}).then(function(user){
                        deferred.resolve(user);
                    }, deferred.reject);
                }, deferred.reject);
                return deferred.promise;                
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
        .factory('UserService', ["$rootScope", "$sailsPromised", "RELOAD", function($rootScope, $sailsPromised, RELOAD){

            function getUsers() {
                return $sailsPromised.get('/users');
            }

            function getUsersByGroupId(groupId) {
                return $sailsPromised.get('/groups/' + groupId + '/members')
            }

            function newUser(user) {
                return $sailsPromised.post('/users', user).then(function(newUser){
                    $rootScope.$broadcast(RELOAD.USER, {verb: 'created', data: newUser});
                    return newUser;
                });
            }

            function deleteUser(user) {
                return $sailsPromised.delete('/users/' + user.id).then(function(deletedUser){
                    $rootScope.$broadcast(RELOAD.USER, {verb: 'deleted', data: deletedUser});
                    return deletedUser;
                });
            }

            function getUserById(id) {
                return $sailsPromised.get('/users/'+id);
            }

            function deleteUserFromGroup(user, groupId) {
                return $sailsPromised.delete('/groups/'+ groupId + '/members/' + user.id).then(function(deletedUser){
                    $rootScope.$broadcast(RELOAD.USER);
                    return deletedUser;
                });;
            }

            function addUserToGroup(user, groupId) {
                return $sailsPromised.post('/groups/'+ groupId + '/members/' + user.id).then(function(newUser){
                    $rootScope.$broadcast(RELOAD.USER, {verb: 'created', data: newUser});
                    return newUser;
                });
            }

            return {
                getUsers: getUsers,
                newUser: newUser,
                deleteUser: deleteUser,
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
        .controller('AddMembersCtrl', ["$rootScope", "$scope", "$q", "$stateParams", "$ionicPopup", "UserService", "GroupService", "RELOAD", function(
                $rootScope, 
                $scope, 
                $q, 
                $stateParams, 
                $ionicPopup, 
                UserService, 
                GroupService,
                RELOAD
            ){
            var vm = this;
            vm.group = {};
            vm.members = [];
            vm.users = [];

            function _reset() {
                vm.title = 'add Members';
            }

            function _reloadGroup() {
                GroupService.getGroupById($stateParams.id).then(function(group){
                    vm.group = group;
                });
            }

            function _reloadMembers() {
                $q.all([UserService.getUsers(), UserService.getUsersByGroupId($stateParams.id)]).then(function(results){
                    vm.users = results[0];
                    vm.members = results[1];
                    var isInGroup = {};
                    for(var i in vm.members) {
                        isInGroup[vm.members[i].id] = true;
                    }

                    angular.forEach(vm.users, function(user, key){
                        vm.users[key].isInGroup = !!isInGroup[user.id] || !!vm.users[key].isInGroup;
                        vm.users[key].wasInGroup = !!isInGroup[user.id];
                    })
                });
            }

            function _reload() {
                _reloadGroup();
                _reloadMembers();
            }

            _reset();
            _reload();

            $rootScope.$broadcast(RELOAD.USER, _reloadMembers);
            $rootScope.$broadcast(RELOAD.GROUP, _reloadGroup);

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