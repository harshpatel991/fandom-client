var fandomControllers = angular.module('fandomControllers', []);

var apiLocation = 'http://localhost:4000/api';

fandomControllers.controller('profileController', ['$scope', '$routeParams', '$http', '$window', 'UsersService', function($scope, $routeParams, $http, $window, Users) {
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
			function (data) { //onSuccess
				console.log(data);

				$scope.profile = true;
				$scope.user = data.user;
			},
			function () { //onError
				//TODO: error message
			}
		);
}]);

fandomControllers.controller('profileUserController', ['$scope', '$routeParams', '$http', '$window', 'UsersService', 'ShowsService', function($scope, $routeParams, $http, $window, Users, Shows) {
	var userId = $routeParams.user_id;

	Users.getUserProfile(userId,
		function (data) { //onSuccess
			console.log('user profile');
			console.log(data);

			$scope.userProfile = data.data;
		},
		function () { //onError
			//TODO: error message
		}
	);
}]);

fandomControllers.controller('profileCommentsController', ['$scope', '$routeParams', '$http', '$window', 'CommentsService', function($scope, $routeParams, $http, $window, Comments) {
	$scope.selectedUserId = $routeParams.user_id;

	Comments.getUserComments($scope.selectedUserId,
		function (data) { //onSuccess
			console.log(data);

			$scope.userComments = data;
			$scope.userComments.sort(function(a,b){return new Date(b.post_time) - new Date(a.post_time);});
		},
		function () { //onError
			//TODO: error message
		}
	);
}]);

fandomControllers.controller('profileFavoritesController', ['$scope', '$routeParams', '$http', '$window', 'ShowsService', function($scope, $routeParams, $http, $window, Shows) {
	$scope.selectedUserId = $routeParams.user_id;

	Shows.getFavoriteShows($scope.selectedUserId,
		function (data) { //onSuccess
			$scope.userFavorites = data;
		},
		function () { //onError
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
	$scope.search = new Object(); //the object used by search genre filter
	$scope.search['genres'] = '';

	Shows.getAllShows(
		function(data){ //onSuccess
			$scope.shows = data;

			//go through all the shows put the genres in
			var genres = new Object();
			for (var movieIndex = 0; movieIndex < $scope.shows.length; movieIndex++) {
				for(var genreIndex = 0; genreIndex < $scope.shows[movieIndex]['genres'].length; genreIndex++) {
					var genre = $scope.shows[movieIndex]['genres'][genreIndex];
					genres[genre] = genre; //add to array
				}
			}

			$scope.genres = genres;



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

			checkInFavorites();

		},
		function() { }//onError
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

							setTimeout(function () { //hacky hack...
								$("[class='rating']").each(function() {$(this).rating();});
							}, 500);


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
fandomControllers.controller('episodeController', ['$scope', '$routeParams', '$window', 'CommentsService', 'UsersService', 'EpisodeService', 'ShowsService', function($scope, $routeParams, $window, Comments, Users, Episode, Shows) {
	var epId = $routeParams.ep_id;
	$("#user-rating").rating(); //initialize user ratings

	$('#user-rating').on('rating.change', function(event, value, caption) { //stars were clicked on

		var oldRatingValue = 0;
		//find the location of the rating in the users episode_ratings and remove it
		for(var ratingIndex = 0; ratingIndex < $scope.user.episodes_ratings.length; ratingIndex++) {
			var key;
			for (key in $scope.user.episodes_ratings[ratingIndex]) break;
			if(key === epId) { //remove the object from the array
				oldRatingValue =  $scope.user.episodes_ratings[ratingIndex][key];
				$scope.user.episodes_ratings.splice(ratingIndex, 1);
				break;
			}
		}

		var ratingPair = {}; //new item to insert into episodes_ratings
		ratingPair[epId] = value
		$scope.user.episodes_ratings.push(ratingPair);

		Users.editUser($scope.user, //Update the user
			function(){}, //onSuccess, don't need to do anything here,
			function(){} //onError
		);

		//Update the episode
		Episode.editRating($scope.episode._id, (oldRatingValue === 0), value-oldRatingValue, //add difference between rating and increase
			function(data) { //onSuccess
				$scope.episode.rating_sum = data.rating_sum;
				$scope.episode.rating_count = data.rating_count;
				$("#average-rating").rating('update', $scope.episode.rating_sum/$scope.episode.rating_count);
			},
			function() {} //onError
		);
	});


	Users.getProfile(
		function(data) { //onSuccess
			$scope.profile = true;
			$scope.user = data.user;

			//find the location of the rating in the users episode_ratings
			for(var ratingIndex = 0; ratingIndex < $scope.user.episodes_ratings.length; ratingIndex++) {
				var key;
				for (key in $scope.user.episodes_ratings[ratingIndex]) break;
				if(key === epId) {
					var usersRating = $scope.user.episodes_ratings[ratingIndex][key];
					$("#user-rating").rating('update', usersRating);
					break;
				}
			}

		},
		function() {}//onError
	);

	Episode.getEpisode(epId,
		function(data) { //onSuccess
			$scope.episode = data;
			$("#average-rating").val($scope.episode.rating_sum/$scope.episode.rating_count);
			$("#average-rating").rating();

			if(data.img_url === "") { //if the episode doesn't have an image, load the shows image
				Shows.getShow($scope.episode.show_id,
					function(show) { //onSuccess
						$scope.episode.img_filename = show.img_filename;
					},
					function() {} //onError
				);
			}
		},
		function() {} //onError
	);

	Comments.getComments(epId,
		function(data){ //onSuccess
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
