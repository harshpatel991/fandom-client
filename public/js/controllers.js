var passportApp = angular.module('passportApp', []);

passportApp.controller('profileController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

  $scope.logout = function () {
    $http.get('http://localhost:4000/api/logout').success(function(data) {
      console.log(data);
      if(!data.error) {
        $window.location = '/login.html'; //redirect
      }
    });
  };

  $scope.profile = false;
  $http.get('http://localhost:4000/api/profile').success(function(data) {
    console.log(data);
    if(!data.error) {
      $scope.profile = true;
      $scope.user = data.user;
    }

  });
}]);

passportApp.controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
  $scope.login = function () {

    var baseUrl = 'http://localhost:4000';
    data =  $http({
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: baseUrl+'/api/login/',
      data: $.param({email: $scope.email, password: $scope.password})
    }).
        success(function(data, status, headers, config) {
          console.log("POST to Login returned good: " + data + "status: " + status);
          $window.location = '/profile.html';

        }).
        error(function(data, status, headers, config) {
          console.log("POST to Login returned bad: " + data + "status: " + status);

        });
  }
}
]);

passportApp.controller('signupController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
  $scope.signup = function () {

    var baseUrl = 'http://localhost:4000';
    data =  $http({
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: baseUrl+'/api/signup/',
      data: $.param({email: $scope.email, password: $scope.password})
    }).
        success(function(data, status, headers, config) {
          console.log("POST to signup was good: " + data + "status: " + status);
          $window.location = '/profile.html'; //redirect

        }).
        error(function(data, status, headers, config) {
          console.log("POST to signup was bad: " + data + "status: " + status);

        });
  }
}
]);
