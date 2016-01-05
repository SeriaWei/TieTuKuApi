angular
	.module("api", ['ngRoute'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'album.html',
				controller: 'albumController'
			})
			.when('/albumpic/:aid/:name', {
				templateUrl: 'albumPic.html',
				controller: 'albumPicController'
			})
			.when('/albumpic/:aid/:name/:p', {
				templateUrl: 'albumPic.html',
				controller: 'albumPicController'
			});
	})
	.directive("ngFile", function ($parse, tuKuApi) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				element.bind("change", function () {
					if (this.files.length > 0) {
						scope.$apply(function () {
							scope.loading = true;
						});
						tuKuApi.upload(this, scope.aid, function (data) {
							scope.$apply(function () {
								scope.newPic = data;
								scope.loading = false;
							});
						});
					}
				});
			}
		}
	})
	.directive("ngTrigger", function ($parse) {
		return {
			restrict: "A",
			link: function (scope, element, attrs) {
				element.bind("click", function (e) {
					angular.element(e.target).next()[0].click();
				});
			}
		}
	})
	.service("tuKuApi", function () {		
		return new tieTuKu("8785e5649fcb34a820f4166de62887851a303404",
			"f6da983de97064ae36a467aa6bf0dce071a0cfd9",
			"cGyemsdmaGmdzMaSlGTFmmJmzGZjmZiYnGloa2ppb21plpmVlWViacOblGiSYpU=");
	})
	.controller("albumController", function ($scope, tuKuApi) {
		$scope.reloadAlbum = function () {
			tuKuApi.getAlbum(1, function (data) {
				$scope.$apply(function () {
					$scope.albumInfo = data;
				});
			});
		}
		$scope.createAlbum = function () {
			tuKuApi.createAlbum($scope.albumName, function (data) {
				$scope.reloadAlbum();
			});
		}
		$scope.reloadAlbum();
	})
	.controller("albumPicController", function ($scope, $routeParams, tuKuApi) {
		$scope.aid = $routeParams.aid;
		$scope.albumName = $routeParams.name;
		$scope.p = parseInt($routeParams.p || 1);
		$scope.getpic = function () {
			$scope.loading = true;
			$scope.newPic = null;
			tuKuApi.getAlbumPic($scope.p, $routeParams.aid, function (data) {
				$scope.$apply(function () {
					$scope.pageArray = new Array(data.pages);
					$scope.picInfo = data;
					$scope.loading = false;
				});
			});
		}
		$scope.editAlbum = function () {
			tuKuApi.updateAlbum($scope.aid, $scope.albumName, function (data) {
				console.log(data)
			});
		}
		$scope.deleteAlbum = function () {
			tuKuApi.deleteAlbum($scope.aid, function () {
				window.location.href = "/";
			});
		}
		$scope.deletePic = function (pid) {
			tuKuApi.deletePic(pid, function () {
				$scope.getpic();
			});
		}
		$scope.getpic();
	});