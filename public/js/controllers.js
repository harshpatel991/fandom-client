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

fandomControllers.controller('showController', ['$scope', '$routeParams', '$http', '$window', 'UsersService', 'ShowsService', 'SeasonService', 'EpisodeService', function($scope, $routeParams, $http, $window, Users, Shows, Seasons, Episode) {
	var showId = $routeParams.show_id;
	$scope.isInFavorites = false;

	Users.getProfile(
		function(data) { //onSuccess
			$scope.profile = true;
			$scope.user = data.user;

			console.log($scope.user.favorites);
			checkInFavorites();

		},
		function() {}//onError
	);


	$scope.allEpisodes = [];
	$scope.allSeasons = [];

	Shows.getShow(showId,
		function(data){ //onSuccess
			$scope.show = data;

			//Grab the seasons
			Seasons.getSeasons($scope.show.seasons,
				function(seasonsList) {
					$scope.allSeasons = seasonsList;

					var allEpisodeIds = [];

					for(var i = 0; i<seasonsList.length; i++) {
						aSeason = seasonsList[i];
						allEpisodeIds = allEpisodeIds.concat(aSeason.episodes);
					}
					Episode.getEpisodes(allEpisodeIds,
						function(data) { //onSuccess
							$scope.allEpisodes = data;
						},
						function(){} //onError
					);
				},
				function(){}//onError
			);
		},
		function(){} //onError
	);

	$scope.addToFavorites = function() {
		$scope.user.favorites.push(showId);
		saveUser();
	};

	$scope.removeFromFavorites = function() {
		console.log($scope.user.favorites);

		for (var index = 0; index < $scope.user.favorites.length; index++) { //find the index where this show_id exists and remove it
			if ($scope.user.favorites[index] == showId) {
				$scope.user.favorites.splice(index, 1);
				break;
			}
		}

		if($scope.user.favorites.length === 0) {
			$scope.user.favorites = [""];
		}

		saveUser();
	};

	function saveUser() {
		Users.editUser($scope.user,
			function(data) { //onSuccess
				$scope.user = data;
				checkInFavorites(); //update in favorites status
				console.log($scope.user.favorites);
			},
			function() { //onError

			}
		);
	}

	function checkInFavorites() { //check if the current show is in this users favorites
		$scope.isInFavorites = false;
		for (var index = 0; index < $scope.user.favorites.length; index++) { //find if the show exists in this array
			if ($scope.user.favorites[index] == showId) {
				$scope.isInFavorites = true;
				break;
			}
		}
	}

}]);


//-------------------episodeController---------------------//
fandomControllers.controller('episodeController', ['$scope', '$routeParams', '$window', 'CommentsService', 'UsersService', 'EpisodeService', function($scope, $routeParams, $window, Comments, Users, Episode) {
	var epId = $routeParams.ep_id;

	Users.getProfile(
		function(data) { //onSuccess
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
				console.log("Vote comment finished: ");
				console.log(data);
				//reload the comment
				Comments.getComments($scope.episode._id,
					function(data){ //onSuccess
						// console.log("load successfully");
						$scope.comments = data;
					},
					function(data) { //onFailure

					}
				);
			},
			function(data){
				console.log("Vote comment failed: " + data);
			}
		);
	};
}]);
