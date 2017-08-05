(function (angular) {
    angular
        .module("app", ['ui.bootstrap', 'ui.router', 'ngTable'])
        .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
            $urlRouterProvider.when("", ["$state", function ($state) {
                $state.go("root")
            }]);
            $stateProvider
				.state('root', {
                    url: '/login',
                    title: "syncLogin",
                    views: {
                        '@': {
                            templateUrl: 'app/sync-login/index.html',
                            controller: 'app.syncLoginController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('root.Dashboard', {
                    url: 'Dashboard',
                    title: "Dashboard",
                    views: {
                        '@': {
                            templateUrl: 'app/dashboard/index.html',
                            controller: 'app.dashboardController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('root.syncSystem', {
                    url: 'sync-system',
                    title: "Sync System",
                    views: {
                        '@': {
                            templateUrl: 'app/sync-system/index.html',
                            controller: 'app.syncSystemController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('root.syncPath', {
                    url: 'sync-path',
                    title: "Sync Path",
                    views: {
                        '@': {
                            templateUrl: 'app/sync-path/index.html',
                            controller: 'app.syncPathController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('root.logs', {
                    url: 'logs/id=:syncpathid/syncpathcode=:syncpathcode/date=:date',
                    title: "logs",
                    views: {
                        '@': {
                            templateUrl: 'app/logs/index.html',
                            controller: 'app.logController',
                            controllerAs: 'vm'
                        }
                    }
                })
                .state('root.syncPathNew', {
                    url: 'syncPathNew/id=:syncpathid',
                    title: "syncPathNew",
                    views: {
                        '@': {
                            templateUrl: 'app/syncpath-new/index.html',
                            controller: 'app.syncPathNewController',
                            controllerAs: 'vm'
                        }
                    }
                });
        }]) 
		.directive('loading', function () {
			  return {
				restrict: 'E',
				replace:true,
				template: '<div class="loading"><img src="http://www.nasa.gov/multimedia/videogallery/ajax-loader.gif" width="50" height="50" />LOADING...</div>',
				link: function (scope, element, attr) {
					  scope.$watch('vm.loading', function (val) {
						  if (val)
							  $(element).show();
						  else
							  $(element).hide();
					  });
				}
			  }
		  })
        .value('ServiceUrl',
         {
             Url: window.location.origin + '/API/'
         })
		 .factory('app.userService', function () {
				var fac = {};
				fac.CurrentUser = null;
				fac.SetCurrentUser = function (user) {
					fac.CurrentUser = user;
					sessionStorage.user = angular.toJson(user);
				}
				fac.GetCurrentUser = function () {
					fac.CurrentUser = angular.fromJson(sessionStorage.user);
					return fac.CurrentUser;
				}
				return fac;
		})
		.config(['$httpProvider', function ($httpProvider) {
					var interceptor = function(userService, $q, $location)
					{
						return {
							request: function (config) {
								var currentUser = userService.GetCurrentUser();
								if (currentUser != null) {
									config.headers['Authorization'] = 'Bearer ' + currentUser.access_token;
								}
								return config;
							},
							responseError : function(rejection)
							{
								/*if (rejection.status === 401) {
									$location.path('/');
									return $q.reject(rejection);
								}
								if (rejection.status === 403) {
									$location.path('/');
									return $q.reject(rejection);
								}*/
								$location.path('/login');
								return $q.reject(rejection);
							}
				 
						}
					}
					var params = ['app.userService', '$q', '$location'];
					interceptor.$inject = params;
					$httpProvider.interceptors.push(interceptor);
				}]);

        $('.nav li').click(function(e) {
            $('.nav li.active').removeClass('active');
            var $this = $(this);
            if (!$this.hasClass('active')) {
                $this.addClass('active');
                return true;
            }
            e.preventDefault();
        });

        $('ul.nav li.dropdown').hover(function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeIn(500);
            }, function() {
            $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(500);
        });

}(angular));



(function (angular) {

    angular
        .module('app')
        .factory("app.accountService", ['$http','$rootScope','ServiceUrl','$q','app.userService', factory]);

    function factory($http,$rootScope,ServiceUrl,$q,userService) {
        function accountService(){
            var s = this;
            s.init();
        };
		
		
        var syncLogin = accountService.prototype;
				syncLogin.login = function (user) {
					//var obj = { 'username': user.username, 'password': user.password, 'grant_type': 'password' };
					var obj = { 'username': "user", 'password': "user", 'grant_type': 'password' };
					Object.toparams = function ObjectsToParams(obj) {
						var p = [];
						for (var key in obj) {
							p.push(key + '=' + encodeURIComponent(obj[key]));
						}
						return p.join('&');
					}
			 
					var defer = $q.defer();
					$http({
						method: 'post',
						url: ServiceUrl.Url + "/token",
						data: Object.toparams(obj),
						headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
					}).then(function (response) {
						userService.SetCurrentUser(response.data);
						defer.resolve(response.data);
					}, function (error) {
						defer.reject(error.data);
					})
					return defer.promise;
				}
				syncLogin.login();
				syncLogin.logout = function () {
					userService.CurrentUser = null;
					userService.SetCurrentUser(userService.CurrentUser);
				}
				 syncLogin.init = function(){
					var s = this;
					return s;
				};

				//return fac;
		
        return new accountService();
    }
})
(angular);