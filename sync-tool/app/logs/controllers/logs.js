(function (angular) {

     angular
        .module('app')
        .controller("app.exceptionLogController",[
            '$scope', 
            '$uibModal',
            '$uibModalInstance',
            'app.logService',
            'app.logModel',
            '$state',
             exceptionLogController]);

    function exceptionLogController($scope,$uibModal,$uibModalInstance,svc,logModel,$state){
        var vm = this;            
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
       
             vm.getUrlParameter = function getUrlParameter(sParam) {
                var sPageURL = decodeURIComponent(window.location.href),
                    sURLVariables = sPageURL.split('/'),
                    sParameterName,
                    i;

                for (i = 0; i < sURLVariables.length; i++) {
                    sParameterName = sURLVariables[i].split('=');

                    if (sParameterName[0] === sParam) {
                        return sParameterName[1] === undefined ? true : sParameterName[1];
                    }
                }
            };

        vm.init = function() { 
            vm.model = model = new logModel();
            vm.loc=window.location.href;
            vm.syncpathid = vm.getUrlParameter("syncpathcode");           
            vm.SyncPathDisplayCode= vm.syncpathid;
            vm.generateBathFiles(vm.syncpathid);
        }
        
        vm.downloadFile=function(row){
            svc.downLoadLog(row.FileName).then(
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
        vm.generateBathFiles=function(code){
            svc.getSyncLogFiles(code).then(
                function(response){
                     model.setLogFilesData(response.data.Data);               
                },function(response){
                     alert("Failed!")
                }
            );
        };
         vm.init();
    };




    angular
        .module('app')
        .controller("app.logController", [
            '$scope', 
            '$state',
            '$uibModal',
            'app.logModel',
            'app.logService',
            'app.syncPathService',
            'app.syncPathNewService', syncSystemController]);

    function syncSystemController(
        $scope, 
        $state, 
        $modal,
        logModel, 
        svc,
        syncPathServiceSvc,
        syncPathNewService) {

        //Properties
        var vm = this,
            destWatch, 
            model;
        
        //Methods
        vm.init = function() { 
             vm.showDashboard=false;
             vm.showsyncButton=true;   
             vm.syncpathid= $scope.$resolve.$stateParams.syncpathid;
             vm.lastRunDate = $scope.$resolve.$stateParams.date;
             vm.lastDate=vm.lastRunDate;
                if(vm.lastRunDate!=undefined && vm.lastRunDate!=""){
                    vm.showDashboard=true;
                    vm.myDate = new Date(vm.lastRunDate)
                    vm.myDate.setDate(vm.myDate.getDate() + 1)
                    vm.lastRunDate = vm.lastRunDate.replace('T',' ')
                    vm.datetime= new Date(vm.lastRunDate);
                    vm.date =$.datepicker.formatDate('mm/dd/yy', vm.datetime);
                    vm.dateNext =$.datepicker.formatDate('mm/dd/yy', vm.myDate);
                    vm.time=vm.datetime.getHours() + ":" + vm.datetime.getMinutes() + ":" + vm.datetime.getSeconds()
                    vm.timeNext=vm.myDate.getHours() + ":" + vm.myDate.getMinutes() + ":" + vm.myDate.getSeconds()
                    vm.datetime=vm.date+' '+ vm.time;
                    vm.myDate=vm.dateNext+' '+vm.timeNext
                    vm.showsyncButton=false;                    
                    vm.log= {
                            "StartTime":  vm.datetime,
                            "EndTime":  vm.myDate
                            };
                    svc.getSyncLog(vm.syncpathid,vm.lastRunDate,vm.lastRunDate).then(function(response){              
                        model.setSyncLogData(response.data.Data);
                    },function(response){
                        vm.model.errorData=response;
                    });   
                }
             //For displaying date picker.
             $(function(){
                $("#StartTime").datepicker();
                $("#EndTime").datepicker();
                $('.form_datetime').datetimepicker({weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1, startView: 2,forceParse: 0, showMeridian: 1 , minuteStep: 1});
            });        
            vm.model = model = new logModel();
           vm.validation=false;
            if(syncPathServiceSvc.syncedit!=undefined){
                    vm.syncId=syncPathServiceSvc.syncedit.SyncPathID;
                    syncPathServiceSvc.syncedit=null;
            }
            svc.getSyncSystem().then(function(response){
                vm.model.data=response;
                 model.setData(response.data.Data);
            },function(response){
                 vm.model.errorData=response;
            });
            syncPathNewService.getSyncPathData(vm.syncpathid).then(function(response){
                    vm.model.syncpathdisplaytext=response.data.Data[0].SourceSystemName+' >> '+response.data.Data[0].TargetSystemName+' >> '+response.data.Data[0].SyncPathCode;               
                },function(response){
            });
            vm.getSyncLog();

             vm.originalRow={};
             vm.rowform={};
             vm.enableAdd=false;
             vm.editcount=0;
            // any init logic to be handled here
            destWatch = $scope.$on("$destroy", vm.destroy);
        };
        
        vm.getSyncLog =function(){   
                   
            if(vm.datetime!=undefined){
                vm.Startdate= vm.lastDate;
                vm.Enddate= vm.lastDate;
            }
             if(vm.log != undefined){
                 vm.Startdate=vm.log.StartTime;
                 vm.Enddate=vm.log.EndTime;
            } 
            svc.getSyncLog(vm.syncpathid,vm.Startdate,vm.Enddate).then(function(response){              
                model.setSyncLogData(response.data.Data);
            },function(response){
                 vm.model.errorData=response;
            });

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

        vm.change = function(){
           if(vm.syncPath!=null){
                 vm.filtereddata= vm.model.data.data.Data.filter(function (el) {
                                                    return el.SyncPathID ==  vm.syncPath 
                                                });
                     model.setSyncLogData(vm.filtereddata);
           }else{
                 model.setSyncLogData(vm.model.data.data.Data);
           }
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
        
         vm.showModal = function(row) {
             svc.getSyncPathCode(row);
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