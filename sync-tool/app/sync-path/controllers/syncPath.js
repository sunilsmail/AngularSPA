(function (angular) {

    angular
        .module('app')
        .controller("app.syncPathController", [
            '$scope', 
            '$state',
            '$uibModal',
            'app.syncPathModel',
            'app.syncPathService',
            'app.syncSystemService', syncPathController]);

    function syncPathController(
        $scope, 
        $state,   
        $modal,
        syncPathModel, 
        svc,
        syncSystemService) {

        //Properties
        var vm = this,
            destWatch, 
            model;
		
        //Methods
        vm.init = function() {
            vm.model = model = new syncPathModel();
            model.setData(svc.get());
			vm.disabletargetddl=true;
            syncSystemService.getSyncSystem().then(function(response){
                vm.lstSourceTargetdata=response.data.Data;
            },function(response){
                 vm.model.errorData=response;
            });
            
          
             vm.setTab(vm.model.tab);
            // any init logic to be handled here
            destWatch = $scope.$on("$destroy", vm.destroy);

            if(svc.PageObj!=undefined){
                vm.syncPath=svc.PageObj.syncPath;
                vm.search();
            }
        };
      
        vm.destroy = function(){
            destWatch();
        };

        vm.search = function(){
            if(vm.syncPath==undefined){
                alert('Select Filter');
            }else{
			  vm.submittedScheme = false;
              vm.source=vm.syncPath.SourceSystem;
              vm.target=vm.syncPath.TargetSystem;            
               svc.getSyncPathData(vm.source,vm.target).then(function(response){
                    vm.model.data=response;
                     svc.updateSyncPath(vm);
                    model.setSyncPathData(response.data.Data);
                    },function(response){
                        vm.model.errorData=response;
                });
            }           
        };

        vm.edit=function(row, rowForm,event,from){
            vm.row=row;
            vm.NextSyncTime=$($(event.target).closest("tr").children()[6]).children().text()
            svc.updateSyncPath(vm);
            if(from=="edit"){
                 $state.go('root.syncPathNew',{syncpathid:row.SyncPathID});
            }else{
                 $state.go('root.logs', {syncpathid:row.SyncPathID,syncpathcode:row.SyncPathCode});
            }
           
        };

         vm.setTab = function(newTab){
            vm.tab = newTab;
         };

       vm.isSet = function(tabNum){
            return vm.tab === tabNum;
        };

        vm.showModal = function(row) {
            vm.opts = {
                backdrop: false,
                backdropClick: true,
                windowClass: 'app-modal-window',
                dialogFade: true,
                keyboard: true,
                templateUrl: 'app/logs/ExceptionLog.html',
                controller: 'app.exceptionLogController as vm',
                resolve: {} // empty storage
            };       
            if(vm.DynamicUrl==undefined){
                vm.DynamicUrl = document.location.href;
            }            
            document.location.href =  vm.DynamicUrl+"/syncpathcode="+row.SyncPathCode    
            var modalInstance = $modal.open(vm.opts);
            modalInstance.result.then(function() {
                //on ok button press 
            }, function() {
                //on cancel button press
                console.log("Modal Closed");
            });
        };
        vm.init();
    }
})
(angular);