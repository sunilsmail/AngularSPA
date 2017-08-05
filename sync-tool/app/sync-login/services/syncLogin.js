(function (angular) {

    angular
        .module('app')
        .factory("app.syncLoginService", ['$http','$rootScope','ServiceUrl', factory]);

    function factory($http,$rootScope,ServiceUrl) {
        function syncLoginService(){
            var s = this;
            s.init();
        };

        var p = syncLoginService.prototype;
		
		
			p.GetAnonymousData = function () {
				return $http.get(serviceBasePath + '/api/data/forall').then(function (response) {
					return response.data;
				})
			}
		 
			p.GetAuthenticateData = function () {
				return $http.get(serviceBasePath + '/api/data/authenticate').then(function (response) {
					return response.data;
				})
			}
		 
			p.GetAuthorizeData = function () {
				return $http.get(serviceBasePath + '/api/data/authorize').then(function (response) {
					return response.data;
				})
			}
		
		
        p.init = function(){
            var s = this;
            return s;
        };

        p.updateSyncPath=function(vm){
            var s=this;
            s.PageObj=vm;           
        }
        
        

        p.getSyncPathData=function(source,target){
            var s=this;
            s.url=ServiceUrl.Url+'SyncPath/SyncPath/'+source+'/'+target;
             return $http({
                method: 'GET',
                data: 'json',
                url: s.url
            });
        };
        
        return new syncLoginService();
    }
})
(angular);