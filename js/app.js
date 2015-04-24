// var demoApp = angular.module('demoApp', ['demoControllers']);

var fandomApp = angular.module('fandomApp', ['ngRoute', 'fandomControllers', 'demoServices']);

fandomApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginController'
  }).
  when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'profileController'
  }).
  when('/signup', {
        templateUrl: 'partials/signup.html',
        controller: 'signupController'
  }).
  when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'homeController'
  }).
  otherwise({
    redirectTo: '/home'
  });
}]);

