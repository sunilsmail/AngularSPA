(function (angular) {

     angular
        .module('app')
        .controller("app.batchController",[
            '$scope', 
            '$uibModal',
            '$uibModalInstance',
            'app.syncSystemService',
             batchController]);

    function batchController($scope,$uibModal,$uibModalInstance,svc){
        var vm = this;
        vm.entityCode=[{"Propertyid":1,"PropertyName":"COA"},{"Propertyid":2,"PropertyName":"Property"},{"Propertyid":3,"PropertyName":"Actual"},{"Propertyid":4,"PropertyName":"Budget"},{"Propertyid":5,"PropertyName":"FloorPlan"},{"Propertyid":6,"PropertyName":"Unit"},{"Propertyid":7,"PropertyName":"Tenant"},{"Propertyid":8,"PropertyName":"Lease"},{"Propertyid":9,"PropertyName":"Statistical"}]
        vm.ok = function() {
            $uibModalInstance.close();
        };
        vm.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };        
        vm.downloadBatchFiles=  function (uri, name) 
            {
                var link = document.createElement("a");
                link.download = name;
                link.href = uri;
                link.click();
            };
        vm.generateBathFiles=function(){
            svc.generateBathFiles().then(
                function(response){
                    if(response.data.Status=="Success"){
                          alert("Success!");
                    }                  
                },function(response){
                     alert("Failed!")
                }
            );

        };


         vm.downloadFile=function(row){
            svc.downLoadBatchLog().then(
                function(data, status, headers){
                        headers = data.headers();                
                        var filename = headers['x-filename'];
                        var contentType = headers['content-type']; 
                        try {
                            var blob = new Blob([data.data], { type: contentType });
                            var ua = window.navigator.userAgent;
                            var msie = ua.indexOf("MSIE ");
                            if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)){
                                window.navigator.msSaveBlob(blob, filename);
                            }else{
                                var linkElement = document.createElement('a');                             
                                var url = window.URL.createObjectURL(blob);                    
                                linkElement.setAttribute('href', url);
                                linkElement.setAttribute("download", filename);                    
                                var clickEvent = new MouseEvent("click", {
                                    "view": window,
                                    "bubbles": true,
                                    "cancelable": false
                                });
                                linkElement.dispatchEvent(clickEvent);
                            }                            
                        } catch (ex) {
                            console.log(ex);
                          }

                },function(response){
                     alert("Failed!")
                }
            );
        };

    };
    

    angular
        .module('app')
        .controller("app.syncSystemController", [
            '$scope', 
            '$state',
            '$uibModal',
            'app.syncSystemdModel',
            'app.syncSystemService', syncSystemController]);

    function syncSystemController(
        $scope, 
        $state, 
        $modal,
        syncSystemdModel, 
        svc) {

        //Properties
        var vm = this,
            destWatch, 
            model;       

        //Methods
        vm.init = function() {
            vm.model = model = new syncSystemdModel();
           vm.validation=false;
            svc.getSyncSystem().then(function(response){
                vm.model.data=response;
                 model.setData(response.data.Data);
            },function(response){
                 vm.model.errorData=response;
            });

             vm.originalRow={};
             vm.rowform={};
             vm.enableAdd=false;
             vm.editcount=0;
            // any init logic to be handled here
            destWatch = $scope.$on("$destroy", vm.destroy);
        };
        

        vm.goToSyncPath =  function(){
            $state.go('root.syncPath');
        };

        vm.goToSyncSystem =  function(){
            $state.go('root.syncSystem');
        };

        vm.destroy = function(){
            destWatch();
        };

        vm.save = function(row, rowForm){            
            vm.editcount=0;
             svc.updateSyncSystem(row).then(function(response){
                        //alert("Record Saved")
                    vm.validation=true;
                      setTimeout(function() {$(".alert").fadeTo(500, 0).slideUp(500, function(){ $(this).remove();});}, 500);
                    },function(response){
                        alert("error");
                    });
             model.save(row, rowForm);
        }; 
       
        vm.edit = function(row, rowForm){
            if(vm.editcount==0){
                vm.originalRow = angular.copy(row);
                vm.rowform= angular.copy(rowForm);
                vm.editcount=1;
            }else{
                 row.isEditing=false;
                  $("#SyncSystemValid").show('fade');
                    setTimeout(function(){
                        $("#SyncSystemValid").hide('fade');
                    },2000);
                    $("#SyncSystemclose").click(function(){
                        $("#SyncSystemValid").hide('fade');
                  });
            }      
        };        

        vm.cancel=function(row, rowForm){            
             vm.editcount=0;
            model.cancel(row, rowForm,vm.originalRow);   
            if(vm.enableAdd){
                model.gridConfig.settings().dataset.splice(0,1);
                model.gridConfig.sorting({});
                model.gridConfig.page(1);
                model.gridConfig.reload();
                vm.model=model;
                vm.enableAdd=false;
            }          
        };

        vm.del=function(row){  
            model.gridConfig.settings().dataset.splice(model.gridConfig.data.indexOf(row),1);
            model.gridConfig.sorting({});
            model.gridConfig.page(1);
            model.gridConfig.reload();
            vm.model=model;
        };       

        vm.add=function(){
            vm.enableAdd=true;
            model.gridConfig.settings().dataset.unshift({
                name: "",
                age: null,
                money: null,
                isEditing:true
            });
            // we need to ensure the user sees the new row we've just added.
            // it seems a poor but reliable choice to remove sorting and move them to the first page
            // where we know that our new item was added to
            model.gridConfig.sorting({});
            model.gridConfig.page(1);
            model.gridConfig.reload();
            vm.model=model;
        };
        
        vm.init();

         vm.showModal = function() {
            vm.opts = {
                backdrop: false,
                backdropClick: true,
                windowClass: 'app-modal-window',
                dialogFade: true,
                keyboard: true,
                templateUrl: 'app/sync-system/batch.html',
                controller: 'app.batchController as vm',
                resolve: {} // empty storage
            };           
            var modalInstance = $modal.open(vm.opts);
            modalInstance.result.then(function() {
                //on ok button press 
            }, function() {
                //on cancel button press
                console.log("Modal Closed");
            });
        };
    } 

})
(angular);