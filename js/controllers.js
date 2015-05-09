// Email validation regex taken from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
var fandomControllers = angular.module('fandomControllers', []);
var apiLocation = 'http://localhost:4000/api';

fandomControllers.controller('profileController', ['$scope', '$http', '$window', 'UsersService', 'ShowsService', function($scope, $http, $window, Users, Shows) {
	addUserToScope($scope, Users, $window, Shows, function(){});
}]);

fandomControllers.controller('profileUserController', ['$scope', '$routeParams', '$http', '$window', 'UsersService', 'CommentsService', 'ShowsService', function($scope, $routeParams, $http, $window, Users, Comments, Shows) {
	$scope.mismatchError = true;
	$scope.passwordChangeSuccess = true;
	$scope.selectedUserId = $routeParams.user_id;
	$scope.numberUpvotes = 0;
	$scope.isMyProfile = false;

	addUserToScope($scope, Users, $window, Shows,  //this will set $scope.user
		function(data){ //callback once User.getUser has been called
			$scope.isMyProfile = data.user._id == $scope.selectedUserId;
		}
	);

	Users.getUserProfile($scope.selectedUserId,
		function (data) { //onSuccess
			$scope.userProfile = data.data;
		},
		function () { //onError
			//TODO: error message
		}
	);

	Comments.getUserComments($scope.selectedUserId,
		function (data) { //onSuccess
			var userComments = data;
			for (var i = 0; i < userComments.length; i++){
				$scope.numberUpvotes += parseInt(userComments[i].points);
			}
		},
		function () { //onError
			//TODO: error message
		}
	);

	$scope.changePassword = function(){
		var newPassword = $scope.newPassword.valueOf();
		var confirmPassword = $scope.confirmPassword.valueOf();
		if (newPassword != confirmPassword || newPassword === undefined){
			$('#newPassword').val('');
			$('#confirmPassword').val('');
			$('#passwordChangeError').text('Passwords do not match.');
			$('#passwordChangeSuccess').text('');
			return;
		}
		Users.changePassword($scope.userProfile.local.email, newPassword, function(data){
			//Success
			$('#newPassword').val('');
			$('#confirmPassword').val('');
			$('#passwordChangeError').text('');
			$('#passwordChangeSuccess').text('Password successfully changed!');
			$('#changePassword').collapse('hide');
		},
		function(data){
			//Error
			$('#newPassword').val('');
			$('#confirmPassword').val('');
			$('#passwordChangeError').text('Error: ' + data);
			$('#passwordChangeSuccess').text('');
		})
	};
}]);

fandomControllers.controller('profileCommentsController', ['$scope', '$routeParams', '$http', '$window', 'UsersService', 'CommentsService', 'ShowsService', function($scope, $routeParams, $http, $window, Users, Comments, Shows) {
	$scope.selectedUserId = $routeParams.user_id;
	$scope.commentsEmpty = false;
	$scope.loading = true;
	$scope.numberUpvotes = 0;

	addUserToScope($scope, Users, $window, Shows, function(data){
		$scope.isMyProfile = data.user._id == $scope.selectedUserId;
	});

	Comments.getUserComments($scope.selectedUserId,
		function (data) { //onSuccess
			$scope.loading = false;
			$scope.userComments = data;
			$scope.userComments.sort(function(a,b){return new Date(b.post_time) - new Date(a.post_time);});

			if ($scope.userComments === undefined || $scope.userComments.length === 0){
				$scope.commentsEmpty = true;
			}
			else{
				for (var i = 0; i < $scope.userComments.length; i++){
					$scope.numberUpvotes += parseInt($scope.userComments[i].points);
				}
			}
		},
		function () { //onError
			//TODO: error message
			$scope.loading = false;
			$scope.commentsEmpty = true;
		}
	);
}]);

fandomControllers.controller('profileFavoritesController', ['$scope', '$routeParams', '$http', '$window', 'UsersService', 'ShowsService', 'CommentsService', function($scope, $routeParams, $http, $window, Users, Shows, Comments) {
	$scope.selectedUserId = $routeParams.user_id;
	$scope.isMyProfile = false;
	$scope.favoritesEmpty = false;
	$scope.loading = true;
	$scope.numberUpvotes = 0;

	addUserToScope($scope, Users, $window, Shows, //this will set $scope.user
		function(data){//callback once User.getUser has been called
			$scope.isMyProfile = data.user._id == $scope.selectedUserId;
		}
	);

	Shows.getFavoriteShows($scope.selectedUserId,
		function (data) { //onSuccess
			$scope.loading = false;
			$scope.userFavorites = data;
			if ($scope.userFavorites === undefined || $scope.userFavorites.length === 0){
				$scope.favoritesEmpty = true;
			}
		},
		function () { //onError
			//TODO: error message
			$scope.loading = false;
			$scope.favoritesEmpty = true;
		}
	);

	Comments.getUserComments($scope.selectedUserId,
		function (data) { //onSuccess
			var userComments = data;
			for (var i = 0; i < userComments.length; i++){
				$scope.numberUpvotes += parseInt(userComments[i].points);
			}
		},
		function () { //onError
			//TODO: error message
		}
	);

	$scope.removeFromFavorites = function(showId) {
		if ($scope.userFavorites === undefined || $scope.user === undefined || $scope.selectedUserId != $scope.user._id){
			return;
		}

		for (var index = 0; index < $scope.userFavorites.length; index++) { //find the index where this show_id exists and remove it
			if ($scope.userFavorites[index]._id == showId) {
				$scope.userFavorites.splice(index, 1);
				break;
			}
		}

		for (index = 0; index < $scope.user.favorites.length; index++) { //find the index where this show_id exists and remove it
			if ($scope.user.favorites[index] == showId) {
				$scope.user.favorites.splice(index, 1);
				break;
			}
		}

		if($scope.user.favorites.length === 0) {
			$scope.user.favorites = [""];
		}

		if ($scope.userFavorites === undefined || $scope.userFavorites.length === 0){
			$scope.favoritesEmpty = true;
		}

		saveUser();
	};

	function saveUser() {
		Users.editUser($scope.user,
			function(data) { //onSuccess
				$scope.user = data;

				Shows.getFavoriteShows($scope.user._id, //update our list of favorites
					function (favorites) { //onSuccess
						$scope.favoritesList = favorites;
					},
					function () {} //onError
				);

			},
			function() { //onError
			}
		);
	}
}]);

fandomControllers.controller('loginController', ['$scope', '$http', '$window', 'UsersService', function($scope, $http, $window, Users) {
	$scope.messageError = '';
	$scope.message = '';

	$scope.login = function() {
		$scope.message = 'Loading...';
		Users.login($scope.email, $scope.password,
			function (data) { //onSuccess
				console.log("POST to Login returned good: " + data + "status: " + status);
				$window.location = '#/profile';
				$scope.message = '';
			},
			function (data) { //onFailure
				$scope.messageError = 'Error! Please verify your email and password.';
				$scope.message = '';
			}
		);
	}
}]);

fandomControllers.controller('signupController', ['$scope', '$http', '$window', 'UsersService', function($scope, $http, $window, Users) {
	$scope.messageError = '';
	$scope.message = '';

	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

	$http.defaults.withCredentials = true; //required so that http will send the authentication cookies with request
	$scope.signup = function () {
		$scope.message = 'Loading...';
		if ($scope.email != undefined && $scope.password != undefined && re.test($scope.email) && $scope.password.length > 3) {
			Users.signup($scope.email, $scope.password,
				function (data) {
					$scope.messageError = '';
					$scope.message = '';
					$window.location = '#/profile'; //redirect
				},
				function (data) {
					$scope.messageError = 'Email taken';
					$scope.message = '';
				}
			);
		}
		else {
			$scope.messageError = 'Emails must be valid, passwords must be greater than 3 characters';
			$scope.message = '';
		}
	}
}
]);

fandomControllers.controller('homeController', ['$scope', '$http', '$window', 'ShowsService', 'UsersService', 'ShowsService', function($scope, $http, $window, Shows, Users, Shows) {
	addUserToScope($scope, Users, $window, Shows, function(){});

	$scope.search = new Object(); //the object used by search genre filter
	$scope.search['genres'] = '';
	$scope.sorting = 'name';


	var headerImages = ['header-community.jpg', 'header-got.jpg', 'header-twd.jpg'];
	var headerTitles = ['Community', 'Game of Thrones', 'The Walking Dead'];
	var headerLinks = ['18347', '1399', '1402'];
	var headerLevel1Texts = ['Cool. <br>Cool, cool, cool.', 'The North<br> remembers.', "This is life <br> now."];
	var headerImageIndex = Math.floor((Math.random() * headerImages.length)); //choose a random index to start with

	function setHeader() {
		headerImageIndex = (headerImageIndex + 1) % headerImages.length ;
		$('#home-header-image').css('background-image', 'url(../data/homeImages/'+headerImages[headerImageIndex]+')');
		$('#home-header-text-level-1').html(headerLevel1Texts[headerImageIndex]);
		$('#header-button-text').html('<span class="glyphicon glyphicon-arrow-right"></span> Discuss ' + headerTitles[headerImageIndex]);
		$("#header-button-text").attr("href", "#/show/"+headerLinks[headerImageIndex]);
	}

	setInterval(function(){
		setHeader();
	},7000);
	setHeader();

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

	addUserToScope($scope, Users, $window, Shows,
		function(){
			checkInFavorites();
		}
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

				Shows.getFavoriteShows($scope.user._id, //update our list of favorites for the nav bar
					function (favorites) { //onSuccess
						$scope.favoritesList = favorites;
					},
					function () {} //onError
				);

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
	addUserToScope($scope, Users, $window, Shows,
		function(){
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
		});

	$scope.sorting = 'points';

	var epId = $routeParams.ep_id;
	var viewCommentId = $routeParams.comment_id;
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

	Episode.getEpisode(epId,
		function(data) { //onSuccess
			$scope.episode = data;
			$("#average-rating").val($scope.episode.rating_sum/$scope.episode.rating_count);
			$("#average-rating").rating();
			Shows.getShow($scope.episode.show_id,
				function(show) { //onSuccess
					$scope.show = show;
					$scope.showName = show.name;
					if(data.img_url === "") { //if the episode doesn't have an image, load the shows image
						$scope.episode.img_filename = show.img_filename;
					}
				},
				function() {} //onError
			);
		},
		function() {} //onError
	);

	Comments.getComments(epId,
		function(data){ //onSuccess
			$scope.comments = data;
			scrollToSelectedComment();
		},
		function(data) {} //onFailure
	);

	function scrollToSelectedComment(){

		if (viewCommentId != undefined){
			setTimeout(function() {
				var $selectedComment = $("#" + viewCommentId);
				if ($selectedComment != undefined && $selectedComment.offset() != undefined) {
					$('html, body').animate({
						scrollTop: $selectedComment.offset().top
					}, 500);
				}
			}, 800);
		}
	}

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
		//function(commentText, posterId, posterName, episodeId, parentId, showName, episodeName, onSuccess, onError)
		Comments.addComment(textBoxContent, $scope.user._id, $scope.user.local.email, $scope.episode._id, -1, $scope.showName, $scope.episode.name,
			function(data) { //onSuccess
				console.log("Add parent comment finished: " + data);
				$scope.comments.unshift(data); //add to begining of array
				$scope.hideCommentBox(-1);
			},
			function(data) { //onFailure
				console.log("Add parent comment failed: " + data);
			}
		);
	};

	$scope.submitReplyComment = function(id) { //adding a new reply to a comment
		var textBoxContent = $scope.replyBoxText[id];
		var replyingTo = $scope.comments[id];
		Comments.addComment(textBoxContent, $scope.user._id, $scope.user.local.email, $scope.episode._id, replyingTo._id, $scope.showName, $scope.episode.name,
			function(data) { //onSuccess
				console.log("Add comment finished: " + data);
				$scope.comments.unshift(data);
				$scope.hideCommentBox(id);
			},
			function(data) { //onFailure
				console.log("Add child comment failed: " + data);
			}
		);
	};

	$scope.undoBy = function(comment_id, valueChange) {

		if(valueChange == -1) { //we are removing an upvote
			var commentUpvotedIndex = $scope.user.comments_upvoted.indexOf(comment_id);

			if (commentUpvotedIndex !== -1) {
				$scope.user.comments_upvoted.splice(commentUpvotedIndex, 1); //remove from users array
				if ($scope.user.comments_upvoted.length === 0) { //needed so we can send an empty array
					$scope.user.comments_upvoted = [""];
				}
			}
		}

		else if (valueChange == 1) { //we are removing a down vote
			var commentDownvotedIndex = $scope.user.comments_downvoted.indexOf(comment_id);
			if (commentDownvotedIndex !== -1) {
				$scope.user.comments_downvoted.splice(commentDownvotedIndex, 1); //remove from users array
				if ($scope.user.comments_downvoted.length === 0) { //needed so we can send an empty array
					$scope.user.comments_downvoted = [""];
				}
			}
		}

		Users.editUser($scope.user, //save the user
			function(data) { //onSuccess
				$scope.user = data;
			},
			function() {} //onError
		);

		Comments.voteComments(comment_id, valueChange, //add/subtract from the comment
			function(data){ //on success
				Comments.getComments($scope.episode._id, //reload the comments
					function(data){ //onSuccess
						$scope.comments = data;
					},
					function(data) {} //onFailure
				);
			},
			function(data){ console.log("Undo vote comment failed: " + data);} //onFailure
		);

	};

	$scope.points = function(comment_id, valueChange){

		if($scope.profile === false) { //not logged in
			alert("Please login to vote on comments.");
			return;
		}

		//check if this user has already upvoted/downvoted, remove if so
		var commentUpvotedIndex = $scope.user.comments_upvoted.indexOf(comment_id);
		var commentDownvotedIndex = $scope.user.comments_downvoted.indexOf(comment_id);

		if(commentUpvotedIndex !== -1) { //there's already been a vote so double up and send that
			valueChange = valueChange * 2;
			$scope.user.comments_upvoted.splice(commentUpvotedIndex, 1); //remove from users array
			if($scope.user.comments_upvoted.length === 0) { //needed so we can send an empty array
				$scope.user.comments_upvoted = [""];
			}
		}

		if(commentDownvotedIndex !== -1) { //there's already been a vote so double up and send that
			valueChange = valueChange * 2;
			$scope.user.comments_downvoted.splice(commentDownvotedIndex, 1); //remove from users array
			if($scope.user.comments_downvoted.length === 0) { //needed so we can send an empty array
				$scope.user.comments_downvoted = [""];
			}
		}

		//put in the new item
		if(valueChange > 0) {
			$scope.user.comments_upvoted.push(comment_id);
		} else if(valueChange < 0) {
			$scope.user.comments_downvoted.push(comment_id);
		}

		Users.editUser($scope.user,
			function(data) { //onSuccess
				$scope.user = data;
			},
			function() {} //onError
		);

		Comments.voteComments(comment_id, valueChange,
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

function addUserToScope($scope, Users, $window, Shows, callback) {
	$scope.profile = false;
	$scope.user = undefined;

	$scope.logout = function () {
		Users.logout(
			function(data) { //onSuccess
				if(!data.error) {
					$scope.profile=false;
					$scope.user = undefined;
					$window.location = '#/home';
				}
			},
			function(data) {}//onError
		);
	};

	Users.getProfile(
		function (data) { //onSuccess
			$scope.profile = true;
			$scope.user = data.user;
			callback(data);

			Shows.getFavoriteShows($scope.user._id,
				function (favorites) { //onSuccess
					$scope.favoritesList = favorites;
				},
				function () {} //onError
			);
		},
		function () {} //onError
	);
}