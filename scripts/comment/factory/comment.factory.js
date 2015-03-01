(function(){
    'use strict';

    (function(){
    'use strict';

    angular.module('ws.comment')
        .factory('CommentService', function($rootScope, $sailsPromised, RELOAD) {

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

        })
    ;
})();
})();