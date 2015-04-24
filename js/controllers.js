var fandomControllers = angular.module('fandomControllers', []);

var apiLocation = 'http://localhost:4000/api';

fandomControllers.controller('profileController', ['$scope', '$http', '$window', function($scope, $http, $window) {
  $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request

  $scope.logout = function () {
    $http.get(apiLocation + '/logout').success(function(data) {
      console.log(data);
      if(!data.error) {
        $window.location = '#/login'; //redirect
      }
    });
  };

  $scope.profile = false;
  $http.get(apiLocation + '/profile').success(function(data) {
    console.log(data);
    if(!data.error) {
      $scope.profile = true;
      $scope.user = data.user;
    }

  });
}]);

fandomControllers.controller('loginController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
  $scope.login = function () {

    data =  $http({
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: apiLocation + '/login/',
      data: $.param({email: $scope.email, password: $scope.password})
    }).
        success(function(data, status, headers, config) {
          console.log("POST to Login returned good: " + data + "status: " + status);
          $window.location = '#/profile';

        }).
        error(function(data, status, headers, config) {
          console.log("POST to Login returned bad: " + data + "status: " + status);

        });
  }
}
]);

fandomControllers.controller('signupController', ['$scope', '$http', '$window', function($scope, $http, $window) {

  $http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
  $scope.signup = function () {

    data =  $http({
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      url: apiLocation + '/signup/',
      data: $.param({email: $scope.email, password: $scope.password})
    }).
        success(function(data, status, headers, config) {
          console.log("POST to signup was good: " + data + "status: " + status);
          $window.location = '#/profile'; //redirect

        }).
        error(function(data, status, headers, config) {
          console.log("POST to signup was bad: " + data + "status: " + status);

        });
  }
}
]);

fandomControllers.controller('homeController', ['$scope', '$http', '$window', function($scope, $http, $window) {

}]);
