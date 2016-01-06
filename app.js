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
						var file = this;
						tuKuApi.getService(function (service) {
							service.upload(file, scope.aid, function (data) {
								scope.$apply(function () {
									scope.newPic = data;
									scope.loading = false;
								});
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
		return {
			getService: function (onSuccess) {
				DbContext.getOpenSetting(function (setting) {
					onSuccess.call(this, new tieTuKu(setting.AccessKey, setting.SecretKey, setting.OpenKey));
				});
			}
		};
	})
	.controller("albumController", function ($scope, tuKuApi) {
		$scope.isNeedUpdateOpenKey = false;
		$scope.showOpenKey = function () {
			$scope.isNeedUpdateOpenKey = true;
		}
		$scope.reloadAlbum = function () {
			$scope.loading = true;
			tuKuApi.getService(function (service) {
				service.getAlbum(1, function (data) {
					$scope.$apply(function () {
						$scope.albumInfo = data;
						$scope.loading = false;
					});
				});
			});
		}
		$scope.createAlbum = function () {
			tuKuApi.getService(function (service) {
				service.createAlbum($scope.albumName, function (data) {
					$scope.reloadAlbum();
				});
			});
		}
		$scope.saveOpenKey = function () {
			DbContext.updateOpenSetting($scope.OpenSetting, function () {
				$scope.reloadAlbum();
			});
			$scope.isNeedUpdateOpenKey = false;
		}
		DbContext.getOpenSetting(function (setting) {
			$scope.$apply(function () {
				$scope.OpenSetting = setting;
				if (!setting.AccessKey) {
					$scope.isNeedUpdateOpenKey = true;
				}
			});
		});
		$scope.reloadAlbum();
	})
	.controller("albumPicController", function ($scope, $routeParams, tuKuApi) {
		$scope.aid = $routeParams.aid;
		$scope.albumName = $routeParams.name;
		$scope.p = parseInt($routeParams.p || 1);
		$scope.getpic = function () {
			$scope.loading = true;
			$scope.newPic = null;
			tuKuApi.getService(function (service) {
				service.getAlbumPic($scope.p, $routeParams.aid, function (data) {
					$scope.$apply(function () {
						$scope.pageArray = new Array(data.pages);
						$scope.picInfo = data;
						$scope.loading = false;
					});
				});
			});
		}
		$scope.editAlbum = function () {
			tuKuApi.getService(function (service) {
				service.updateAlbum($scope.aid, $scope.albumName, function (data) {
					console.log(data)
				});
			});
		}
		$scope.deleteAlbum = function () {
			if (confirm('确认要删除相册吗？')) {
				tuKuApi.getService(function (service) {
					service.deleteAlbum($scope.aid, function () {
						window.location.href = "/";
					});
				});
			}
		}
		$scope.deletePic = function (pid) {
			if (confirm('确认要删除图片吗？')) {
				tuKuApi.getService(function (service) {
					service.deletePic(pid, function () {
						$scope.getpic();
					});
				});
			}
		}
		$scope.getpic();
	});