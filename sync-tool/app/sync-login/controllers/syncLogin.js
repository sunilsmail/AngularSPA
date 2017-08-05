(function (angular) {

    angular
        .module('app')
        .controller("app.syncLoginController", [
            '$scope', 
            '$state',
            '$uibModal',
            'app.syncLoginModel',
            'app.syncPathService',
            'app.syncSystemService',
			'app.accountService', syncLoginController]);

    function syncLoginController(
        $scope, 
        $state,   
        $modal,
        syncLoginModel, 
        svc,
        syncSystemService,
		accountService) {

        //Properties
        var vm = this,
            destWatch, 
            model;
		
        //Methods
        vm.init = function() {
			
            vm.model = model = new syncLoginModel();
            // any init logic to be handled here
            destWatch = $scope.$on("$destroy", vm.destroy);
        };
      
        vm.destroy = function(){
            destWatch();
        };
		
		vm.account = {
			username: 'user',
			password: 'user'
		}
        vm.login = function () {
			accountService.login(vm.account).then(function (data) {
				$location.path('/home');
			}, function (error) {
				$scope.message = error.error_description;
			})
		}
		vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        }; 
		
		
		
		vm.init();
    }
})
(angular);