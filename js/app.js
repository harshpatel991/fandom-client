// var demoApp = angular.module('demoApp', ['demoControllers']);

var fandomApp = angular.module('fandomApp', ['ngRoute', 'fandomControllers', 'fandomServices']);

fandomApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/login', {
            templateUrl: 'partials/login.html',
            controller: 'loginController'
        }).
        when('/profile_settings/:user_id', {
            templateUrl: 'partials/profile_settings.html',
            controller: 'profileUserController'
        }).
        when('/profile_comments/:user_id', {
            templateUrl: 'partials/profile_comments.html',
            controller: 'profileCommentsController'
        }).
        when('/profile_favorites/:user_id', {
            templateUrl: 'partials/profile_favorites.html',
            controller: 'profileFavoritesController'
        }).
        when('/signup', {
            templateUrl: 'partials/signup.html',
            controller: 'signupController'
        }).
        when('/home', {
            templateUrl: 'partials/home.html',
            controller: 'homeController'
        }).
        when('/show/:show_id', {
            templateUrl: 'partials/show.html',
            controller: 'showController'
        }).
        when('/episode/:ep_id', {
            templateUrl: 'partials/episode.html',
            controller: 'episodeController'
        }).
        when('/episode/:ep_id/:comment_id', {
            templateUrl: 'partials/episode.html',
            controller: 'episodeController'
        }).
        otherwise({
            redirectTo: '/home'
        });
}]);

