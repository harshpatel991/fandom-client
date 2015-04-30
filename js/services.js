var apiLocation = 'http://localhost:4000/api';

angular.module('fandomServices', [])
    .factory('UsersService', function($http, $window) {
        return {
            login: function (email, password, onSuccess, onError) {
                $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

                $http({
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/login/',
                    data: $.param({email: email, password: password})
                })
                .success(function(data, status, headers, config) {
                    onSuccess(data);

                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },

            signup: function(email, password, onSuccess, onError) {
                $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

                $http({
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/signup/',
                    data: $.param({email: email, password: password})
                })
                .success(function(data, status, headers, config) {
                        onSuccess(data);
                })
                .error(function(data, status, headers, config) {
                        onError(data);
                });
            },

            logout: function(onSuccess, onError) {
                $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

                $http.get(apiLocation + '/logout')
                .success(function(data, status, headers, config) {
                    onSuccess(data);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },

            getProfile: function(onSuccess, onError) {
                $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

                $http.get(apiLocation + '/profile')
                .success(function(data) {
                    onSuccess(data);

                })
                .error(function(data) {
                    onError(data);
                });
            }
        }
    })
    .factory( 'CommentsService', function($http) {
        return {
            addComment: function(commentText, poster, postTime, episodeId, parentId, onSuccess, onError) {

                $http({
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/show_comments/' + episodeId,
                    data: $.param({text: commentText, poster: poster, post_time: postTime, parent_id: parentId })
                })
                .success(function(data, status, headers, config) {
                    onSuccess(data);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },
            getComments: function(episodeId) {

                $http.get(apiLocation + '/show_comments/'+episodeId)
                .success(function(data, status, headers, config) {
                    onSuccess(data);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });

            }
        }
    });