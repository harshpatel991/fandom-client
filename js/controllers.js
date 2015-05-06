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

fandomControllers.controller('homeController', ['$scope', '$http', '$window', 'ShowsService', function($scope, $http, $window, Shows) {

	Shows.getAllShows(
		function(data){ //onSuccess
			$scope.shows = data;
		},
		function(){} //onError
	);

}]);

fandomControllers.controller('showController', ['$scope', '$routeParams', '$http', '$window', 'ShowsService', 'SeasonService', 'EpisodeService', function($scope, $routeParams, $http, $window, Shows, Seasons, Episode) {
	var showId = $routeParams.show_id;

	//$scope.show = {"_id": 1918, "cast": ["Bip", "Bop", "Doodle"], "first_date": "1985-09-27","genres": [ "Drama", "Sci-Fi & Fantasy"],"imdb_id": "","imdb_rating": 8,"img_filename": "the_twilight_zone.jpg",
	//	"keywords": ["anthology"],"last_date": "1988-11-26","name": "The Twilight Zone","networks": ["CBS"], "num_eps": 114,"num_seasons": 3,"remote_img_url": "http://image.tmdb.org/t/p/w500/gPbXTcnyisKxHi4Owkzi1IEjoHg.jpg","seasons": [5553,5550,5551,5552],"summary": "The Twilight Zone is the first of two revivals of Rod Serling's acclaimed 1950/60s television series of the same name. It ran for two seasons on CBS before producing a final season for syndication."}

	Shows.getShow(showId,
		function(data){ //onSuccess
			$scope.show = data;

			console.log($scope.show.seasons);
			for(var i = 0; i < $scope.show.seasons.length; i++) {
				console.log($scope.show.seasons[i]);

				var seasonID = $scope.show.seasons[i];

				Seasons.getSeason(seasonID,
					function(seasonQueryResult) { //onSuccess

						$scope.allSeasons.push(seasonQueryResult.name);

						var seasonsEpisodes = [];

						for (var j = 0; j< seasonQueryResult.episodes.length; j++) { //Query for each episode of each season
							var episodeId = seasonQueryResult.episodes[j];

							Episode.getEpisode(episodeId, //TODO: only query for the episode title
								function(episodeQueryResult) { //onSuccess
									seasonsEpisodes.push(episodeQueryResult);
								},
								function() {} //onError
							);

						}

						$scope.allEpisodes.push(seasonsEpisodes);

					},
					function() {} //onError
				);



			}

		},
		function(){} //onError
	);

	//Query for each season
	$scope.allSeasons = [];
	$scope.allEpisodes = [];


}]);


//-------------------episodeController---------------------//
fandomControllers.controller('episodeController', ['$scope', '$routeParams', '$window', 'CommentsService', 'UsersService', 'EpisodeService', function($scope, $routeParams, $window, Comments, Users, Episode) {
	var epId = $routeParams.ep_id;

	Users.getProfile(
		function(data) { //onSuccess
			// console.log(data);

			$scope.profile = true;
			$scope.user = data.user;
		},
		function() {}//onError
	);

	Episode.getEpisode(epId,
		function(data) { //onSuccess
			$scope.episode = data;
		},
		function() {} //onError
	);

	Comments.getComments(epId,
		function(data){ //onSuccess
			console.log("load successfully");
			$scope.comments = data;
		},
		function(data) { //onFailure

		}
	);

	$scope.showParentReplyBox = false;
	$scope.showChildReplyBox=[];

	$scope.parentReplyBoxText;
	$scope.replyBoxText=[];

	$scope.clickReply = function(id) { //show the comment box
		console.log(id);
		if(id == -1) {
			$scope.showParentReplyBox = true;
		}
		else {

			console.log("Click reply on" + id);
			$scope.showChildReplyBox[id] = true;
		}
	};

	$scope.hideCommentBox = function(id) {
		if(id == -1) {
			$scope.showParentReplyBox = false;
			$scope.parentReplyBoxText = ''; //clear out box
		}
		else {
			$scope.showChildReplyBox[id] = false;
			$scope.replyBoxText[id] = ''; //clear out box
		}
	};

	$scope.submitParentComment = function() { //adding a new parent level comment
		var textBoxContent = $scope.parentReplyBoxText;

		Comments.addComment(textBoxContent, $scope.user._id, $scope.episode._id, -1,
			function(data) { //onSuccess
				console.log("Add parent comment finished: " + data);
				$scope.comments.unshift(data);
				$scope.hideCommentBox(-1);
			},
			function(data) { //onFailure
			}
		);
	};

	$scope.submitReplyComment = function(id) { //adding a new reply to a comment
		var textBoxContent = $scope.replyBoxText[id];
		console.log("Posting: " + $scope.replyBoxText[id]);
		var replyingTo = $scope.comments[id];
		Comments.addComment(textBoxContent, $scope.user._id, $scope.episode._id, replyingTo._id,
			function(data) { //onSuccess
				console.log("Add comment finished: " + data);
				$scope.comments.push(data);
				$scope.hideCommentBox(1);
			},
			function(data) { //onFailure
				console.log("Add comment failed: " + data);
			}
		);
	};

	$scope.points = function(comment_id, type){
		Comments.voteComments(comment_id, type, 
			function(data){ //on success
				console.log("Vote comment finished: " + data);
				//reload the comment
				// Comments.getComments($scope.episode._id,
				// 	function(data){ //onSuccess
				// 		// console.log("load successfully");
				// 		$scope.comments = data;
				// 	},
				// 	function(data) { //onFailure

				// 	}
				// );
			},
			function(data){
				console.log("Vote comment failed: " + data);
			}
		);
	};
}]);
