var fandomControllers = angular.module('fandomControllers', []);

var apiLocation = 'http://localhost:4000/api';

fandomControllers.controller('profileController', ['$scope', '$http', '$window', 'UsersService', function($scope, $http, $window, Users) {
	$scope.profile = false;

	$scope.logout = function () {
		Users.logout(
			function(data) { //onSuccess
				if(!data.error) {
					$window.location = '#/login'; //redirect
				}
			},
			function(data) { //onError
				//TODO: error message
			}
	  );
	};

	Users.getProfile(
		function(data) { //onSuccess
			console.log(data);

			$scope.profile = true;
			$scope.user = data.user;
		},
		function() { //onError
			//TODO: error message
		}
	);

}]);

fandomControllers.controller('loginController', ['$scope', '$http', '$window', 'UsersService', function($scope, $http, $window, Users) {

	$scope.login = function() {
		Users.login($scope.email, $scope.password,
			function (data) { //onSuccess
				console.log("POST to Login returned good: " + data + "status: " + status);
				$window.location = '#/profile';
			},
			function (data) { //onFailure
				console.log("POST to Login returned bad: " + data + "status: " + status);
			}
		);
	}
}]);

fandomControllers.controller('signupController', ['$scope', '$http', '$window', 'UsersService', function($scope, $http, $window, Users) {

	$http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
	$scope.signup = function() {
		Users.signup($scope.email, $scope.password,
			function(data) {
				console.log("POST to signup was good: " + data + "status: " + status);
				$window.location = '#/profile'; //redirect
			},
			function(data) {
				console.log("POST to signup was bad: " + data + "status: " + status);
			}
		);
	}
}
]);

fandomControllers.controller('homeController', ['$scope', '$http', '$window', function($scope, $http, $window) {

	//TODO: replace below with API call
	$scope.shows = [{name: "Game Of Thrones", img_filename: "game_of_thrones.jpg", _id: 1918}, {name: "Community", img_filename:"community.jpg", _id:1919 }]

}]);

fandomControllers.controller('showController', ['$scope', '$http', '$window', function($scope, $http, $window) {

	$scope.show = {"_id": 1918, "cast": ["Bip", "Bop", "Doodle"], "first_date": "1985-09-27","genres": [ "Drama", "Sci-Fi & Fantasy"],"imdb_id": "","imdb_rating": 8,"img_filename": "the_twilight_zone.jpg",
		"keywords": ["anthology"],"last_date": "1988-11-26","name": "The Twilight Zone","networks": ["CBS"], "num_eps": 114,"num_seasons": 3,"remote_img_url": "http://image.tmdb.org/t/p/w500/gPbXTcnyisKxHi4Owkzi1IEjoHg.jpg","seasons": [5553,5550,5551,5552],"summary": "The Twilight Zone is the first of two revivals of Rod Serling's acclaimed 1950/60s television series of the same name. It ran for two seasons on CBS before producing a final season for syndication."}

	//Query for each season

	$scope.allSeasons = [];
	$scope.allEpisodes = [];

	for(var seasonID in $scope.show.seasons) {

		var seasonQueryResult = {"_id": 3649,"air_date": "2013-08-25","episodes": [63424,1005656],"name": "Season Specials","season_number": 0,"show_id": 1403,"summary": ""};
		$scope.allSeasons.push(seasonQueryResult.name);

		var seasonsEpisodes = [];
		for (var episode in seasonQueryResult.episodes) { 	//Query for each episode of each season
			var episodeQueryResult = {name: "Episode blah", _id: 1234};
			seasonsEpisodes.push(episodeQueryResult);
		}

		$scope.allEpisodes.push(seasonsEpisodes);
	}
}]);


fandomControllers.controller('episodeController', ['$scope', '$http', '$window', function($scope, $http, $window) {

	//TODO: replace with API call
	$scope.episode = {"_id": 63414,"air_date": "2013-10-15","episode_number": 4,"imdb_rating": 9,"img_url": "http://image.tmdb.org/t/p/w780/v4qhQJMjdCtmO2aoUsMW4lGNXiK.jpg","name": "Eye Spy","season_number": 1,"show_id": 1403,"summary": "Agent Coulson and the S.H.I.E.L.D. team try to track down a mysterious woman who has single-handedly committed numerous high-stakes heists. But when the woman\u2019s identity is revealed, a troubling secret stands to ruin Coulson."}

	$scope.showReplyBox = [];
	$scope.parentReplyBox = false;

	$scope.clickReply = function(id) { //when clicking to open reply box to episode or to a comment

		if(id == -1) {
			$scope.parentReplyBox = true;
		}
		else {
			$scope.showReplyBox[id] = true;
		}

	};

	$scope.postReply = function(id) {

		//Comments.addComment()

	};
}]);
