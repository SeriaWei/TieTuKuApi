angular
	.module("api", ['ngRoute'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'album.html',
				controller: 'albumController'
			})
			.when('/albumpic/:aid', {
				templateUrl: 'albumPic.html',
				controller: 'albumPicController'
			})
			.when('/albumpic/:aid/p/:p', {
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
		return new tieTuKu("2d11a084b8ef3a977ae58ecb7f2a05b8dfaec57c",
			"da39a3ee5e6b4b0d3255bfef95601890afd80709",
			"apmXlsNhamnGnsiWlJGdmWeXy2dqyMWWbplolGJnmXCcm8fKxWZpmMOblGiSYpU==");
	})
	.controller("albumController", function ($scope, tuKuApi) {
		tuKuApi.getalbum(1, function (data) {
			$scope.$apply(function () {
				$scope.albumInfo = data;
			});
		});
	})
	.controller("albumPicController", function ($scope, $routeParams, tuKuApi) {
		$scope.aid = $routeParams.aid;
		$scope.p = parseInt($routeParams.p || 1);
		$scope.getpic = function () {
			$scope.loading = true;
			$scope.newPic = null;
			tuKuApi.getpiclist($scope.p, $routeParams.aid, function (data) {
				$scope.$apply(function () {
					$scope.pageArray = new Array(data.pages);
					$scope.picInfo = data;
					$scope.loading = false;
				});
			});
		}
		$scope.getpic();
	});