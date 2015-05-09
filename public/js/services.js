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

            changePassword: function(email, newPassword, onSuccess, onError) {
                $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

                $http({
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/change_password/',
                    data: $.param({email: email, password: newPassword})
                })
                .success(function (data, status, headers, config) {
                    onSuccess(data);
                })
                .error(function (data, status, headers, config) {
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
            },

            getUserProfile: function(userId, onSuccess, onError) {
                $http.get(apiLocation + '/users/' + userId)
                    .success(function(data) {
                        onSuccess(data);

                    })
                    .error(function(data) {
                        onError(data);
                    });
            },

            editUser: function(user, onSuccess, onError) {
                $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
                console.log(apiLocation + '/users/'+user._id);
                $http({
                    method: 'PUT',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/users/'+user._id,
                    data: $.param(user)
                })
                .success(function(data, status, headers, config) {
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            }
        }
    })
    .factory( 'CommentsService', function($http) {
        return {
            addComment: function(commentText, poster, episodeId, parentId, onSuccess, onError) {
                var postTime = Date();

                $http({
                    method: 'POST',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/show_comments/' + episodeId,
                    data: $.param({text: commentText, poster: poster, post_time: postTime, parent_id: parentId })
                })
                .success(function(data, status, headers, config) {
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },
            getComments: function(episodeId, onSuccess, onError) {

                $http.get(apiLocation + '/show_comments/'+episodeId)
                .success(function(data, status, headers, config) {
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });

            },

            getUserComments: function(userId, onSuccess, onError) {

                $http.get(apiLocation + '/user_comments/'+userId)
                    .success(function(data, status, headers, config) {
                        onSuccess(data["data"]);
                    })
                    .error(function(data, status, headers, config) {
                        onError(data);
                    });

            },

            voteComments: function(comment_id, valueChange, onSuccess, onError){
                $http({
                    method: 'PUT',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/vote_comments/' + comment_id,
                    data: $.param({valueChange: valueChange})
                })
                .success(function(data, status, headers, config) {
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            }
        }
    })

    .factory('EpisodeService', function($http){
        return {
            getEpisode: function(episodeId, onSuccess, onError){
                $http.get(apiLocation + '/episodes/' + episodeId)
                .success(function(data, status, headers, config){
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },
            getEpisodes: function(episodeIds, onSuccess, onError){
                $http.get(apiLocation + '/episodes?where={"_id": {"$in": ['+episodeIds.join()+']}}')
                    .success(function(data, status, headers, config){
                        onSuccess(data["data"]);
                    })
                    .error(function(data, status, headers, config) {
                        onError(data);
                    });
            },
            editRating: function(episodeId, increaseRating, ratingValueChange, onSuccess, onError) {
                var ratingCountChange = 0;
                if(increaseRating) { ratingCountChange = 1; }
                $http({
                    method: 'PUT',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    url: apiLocation + '/episodes/'+episodeId,
                    data: $.param({_id: episodeId, count_rating: ratingCountChange, star_rating: ratingValueChange})
                })
                    .success(function(data, status, headers, config) {
                        onSuccess(data["data"]);
                    })
                    .error(function(data, status, headers, config) {
                        onError(data);
                    });
            }
        }
    })


    .factory('ShowsService', function($http){
        return {
            getShow: function(showId, onSuccess, onError){
                $http.get(apiLocation + '/shows/' + showId)
                .success(function(data, status, headers, config){
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },
            getFavoriteShows: function(userId, onSuccess, onError){
                $http.get(apiLocation + '/user_favorites/'+userId)
                    .success(function(data, status, headers, config){
                        onSuccess(data["data"]);
                    })
                    .error(function(data, status, headers, config) {
                        onError(data);
                    });
            },
            getAllShows: function(onSuccess, onError) {
                $http.get(apiLocation + '/shows/')
                .success(function(data, status, headers, config){
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            }
        }
    })

    .factory('SeasonService', function($http){
        return {
            getSeason: function(onSuccess, onError){
                $http.get(apiLocation + '/seasons/' + seasonId)
                .success(function(data, status, headers, config){
                    onSuccess(data["data"]);
                })
                .error(function(data, status, headers, config) {
                    onError(data);
                });
            },
            getSeasons: function(seasonIds, onSuccess, onError){
                console.log(apiLocation + '/seasons?where={"_id": {"$in": ['+seasonIds.join()+']}}');
                $http.get(apiLocation + '/seasons?where={"_id": {"$in": ['+seasonIds.join()+']}}')
                    .success(function(data, status, headers, config){
                        onSuccess(data["data"]);
                    })
                    .error(function(data, status, headers, config) {
                        onError(data);
                    });
            }
        }
    });