(function (angular) {

    angular
        .module('app')
        .controller("app.dashboardController", [
            '$scope', 
            '$state',
            'app.dashboardModel',
            'app.dashboardService',
            'app.syncSystemService', dashboardController]);

    function dashboardController(
        $scope, 
        $state, 
        dashboardModel, 
        svc,
        syncSystemService) {

        //Properties
        var vm = this,
            destWatch, 
            model;

        //Methods
        vm.init = function() {
			vm.showAccounttype=true;
            vm.model = model = new dashboardModel();
            model.setData(svc.get());            
             syncSystemService.getSyncSystem().then(function(response){
                vm.lstSourceTargetdata=response.data.Data;
            },function(response){
                 vm.model.errorData=response;
            });
             if(svc.state!=undefined){
                vm.syncPath=svc.state.syncPath;
                vm.search();
            }
            // any init logic to be handled here
            destWatch = $scope.$on("$destroy", vm.destroy);
        };
		
		vm.showAccountType = function(){			
			if(vm.syncPath.TargetSystem==3){
				vm.showAccounttype = false;	
			}else{	
				vm.showAccounttype = true;
			}			
		};

        vm.goToSyncPath =  function(){
           //$state.go('root.syncSystem');  
           setTimeout(()=>{  $state.go('root.syncSystem')},0)   
        };

        vm.goToSyncSystem =  function(){
           $state.go('root.syncSystem');     
        };

        vm.destroy = function(){
            destWatch();
        };

        vm.goTo=function(row){
           $state.go('root.logs', {syncpathid:row.SyncPathId,syncpathcode:row.SyncPathCode,date:row.LastRunTime});
        };


         vm.search = function(){
			 vm.showAccountType();
            if(vm.syncPath==undefined){
                alert('Select Filter');
            }else{
              vm.source=vm.syncPath.SourceSystem;
              vm.target=vm.syncPath.TargetSystem;            
               svc.getSyncSummary(vm.source,vm.target).then(function(response){
                    vm.model.SyncSummarydata=response;
                    svc.stateMaintain(vm);
                    model.setSyncSummary(response.data.Data);
                    },function(response){
                        vm.model.errorData=response;
                });
            }           
        };

        vm.init();
    }
})
(angular);