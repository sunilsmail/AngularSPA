(function (angular) {

    angular
        .module('app')
        .controller("app.syncPathNewController", [
            '$scope', 
            '$state',
            'app.syncPathNewModel',
            'app.syncPathNewService',
            'app.syncSystemService',
            'app.syncPathService',
			'$sce',syncPathNewController]);

    function syncPathNewController(
        $scope, 
        $state, 
        syncPathNewModel, 
        svc,
        SyncSystemSvc,
        syncPathServiceSvc,
		$sce) {

        //Properties
        var vm = this,
            destWatch, 
            model;         
        
        //Methods
        vm.init = function() {	
			vm.trusted = {};
			vm.syncHelpTemplatedesc =`<div class="">
						<div class="row">
							<div class="col-xs-12">
								<div class="row"  style="padding-bottom: 2px;">
									<div class="col-xs-2">
										<b>Yes:</b>
									</div>
									<div class="col-xs-10">
									   Sync's all properties data.
									</div>
								</div>
								<div class="row" >
									<div class="col-xs-2">
										<b>No:</b>
									</div>
									<div class="col-xs-10">
								   Sync's only mapped properties data.
								</div>
								</div>
							</div>
						</div>
					</div>`;
			vm.nonSharedHelpTemplate =`<span>Non-Shared Company<span>`;
			vm.showAccounttype = true;	
            vm.buttontxt="Save Sync Path Details";
            vm.syncPathId= $scope.$resolve.$stateParams.syncpathid;
            if(vm.syncPathId!=undefined && vm.syncPathId!=""){
				vm.loading = true;
                 vm.buttontxt="Update Sync Path Details";
                    svc.getSyncPathData(vm.syncPathId).then(function(response){
                    vm.updatedata=response.data.Data[0];
                    vm.datetime= new Date(response.data.Data[0].NextSyncTime);
                    vm.date =$.datepicker.formatDate('mm/dd/yy', vm.datetime);
                    vm.time=vm.datetime.getHours() + ":" + vm.datetime.getMinutes() + ":" + vm.datetime.getSeconds()
                    vm.datetime=vm.date+' '+ vm.time;
                        vm.syncPath={
                            "Source" : vm.updatedata.SourceSystem,
                            "SourceCompanyId":vm.updatedata.SourceCompanyID,
                            "SourceURL": vm.updatedata.SourceSysURL,
                            "SyncPathCode": vm.updatedata.SyncPathCode,
                            "NextSyncTime": vm.updatedata.SyncInterval,
                            "Target": vm.updatedata.TargetSystem,
                            "TargetCompanyId": vm.updatedata.TargetCompanyID,
                            "TargetURL": vm.updatedata.TargetSysURL,
                            "SyncInterval": vm.datetime,
                            "AutoSync": vm.updatedata.AutoSyncProperty,
                            "IsMultiEntityClient": vm.updatedata.IsMultiEntityClient,
                            "SyncPathID":vm.updatedata.SyncPathID,
							"IsInvAcct": false
                        };
						vm.showAccountType();
						vm.loading = false;
                    },function(response){
                        vm.model.errorData=response;
                });
            }
           
              // any init logic to be handled here
            //For displaying date picker.
             $(function(){
                $( "#SyncInterval" ).datepicker();
                $('.form_datetime').datetimepicker({weekStart: 1,todayBtn:  1,autoclose: 1,todayHighlight: 1, startView: 2,forceParse: 0, showMeridian: 1 });
            });
			
			
            vm.model = model = new syncPathNewModel();           
            vm.setTab(vm.model.tab);
            vm.originalRow={};
            vm.originalRowAccountType={};
            vm.originalRowEntityDomain={};
            vm.rowform={};
            vm.enableAddPropertyMap=false;
            vm.enableAddAccountType=false;
            vm.enableAddEntityDomain = false;
            vm.enablePackageAccountTypeConfig = false;
            vm.enableSyncConfig = false;
            vm.enableAdd=false;
           /* vm.globalPropertyMap=[];
            vm.globalAccountType=[];
            vm.globalEntityDomain=[];*/
            vm.editcountPropertyMap=0;
            vm.editcountAccountType=0;
            vm.editcountEntityDomain = 0;
            vm.editcountPackageAccountTypeConfig = 0;
            vm.editcountSyncConfig = 0;
            

            vm.editcount=0;
            vm.entityCode=[{"Propertyid":1,"PropertyName":"COA"},{"Propertyid":2,"PropertyName":"Property"},{"Propertyid":3,"PropertyName":"Actual"},{"Propertyid":4,"PropertyName":"Budget"},{"Propertyid":5,"PropertyName":"FloorPlan"},{"Propertyid":6,"PropertyName":"Unit"},{"Propertyid":7,"PropertyName":"Tenant"},{"Propertyid":8,"PropertyName":"Lease"},{"Propertyid":9,"PropertyName":"Statistical"}]
            vm.AccountTypeConfig=[{"AccountId":1,"AccountName":"Asset"},{"AccountId":2,"AccountName":"Liability"},{"AccountId":3,"AccountName":"Equity"},{"AccountId":4,"AccountName":"Income"},{"AccountId":5,"AccountName":"Expense"}];
            SyncSystemSvc.getSyncSystem().then(function(response){
                    vm.model.data=response;
                    vm.lstSourceTargetdata=response.data.Data;// model.setSyncSystemData(response.data.Data);
                },function(response){
                    vm.model.errorData=response;
            });

            if(vm.syncPathId>0){
                svc.getEntityMap(vm.syncPathId).then(function(response){
                    vm.globalPropertyMap=response.data.Data;
                    model.setEntityMapData(response.data.Data);
                },function(response){
                    vm.model.errorData=response;
                });

                svc.getAccountTypeConfig(vm.syncPathId).then(function(response){
                    vm.globalAccountType=response.data.Data;
                    model.setAccountTypeConfigData(response.data.Data);
                },function(response){
                    vm.model.errorData=response;
                });

                svc.getEntityDomain(vm.syncPathId).then(function(response){
                    vm.globalEntityDomain=response.data.Data;
                    model.setEntityDomainData(response.data.Data);
                },function(response){
                    vm.model.errorData=response;
                });

                svc.getPackageAccountTypeConfig(vm.syncPathId).then(function (response) {
                    vm.globalPackageAccountTypeConfig = response.data.Data;
                    model.setPackageAccountTypeConfigData(response.data.Data);
                }, function (response) {
                    vm.model.errorData = response;
                });

                svc.getSyncConfig(vm.syncPathId).then(function (response) {
                    vm.globalsetSyncConfig = response.data.Data;
                    model.setSyncConfigData(response.data.Data);
                }, function (response) {
                    vm.model.errorData = response;
                });
            }else{
                //setting empty object if the syncpathid is null
                 model.setEntityMapData([]);
                 model.setAccountTypeConfigData([]);
                 model.setEntityDomainData([]);
                 model.setPackageAccountTypeConfigData([]);
                 model.setSyncConfigData([]);  
            }

            destWatch = $scope.$on("$destroy", vm.destroy);
        };
		
      vm.getPopoverContent= function(content){
		  return vm.trusted[content] || (vm.trusted[content] = $sce.trustAsHtml(content)); 
	  }
		vm.showAccountType = function(){			
			if(vm.syncPath.Target==3){
				vm.showAccounttype = false;	
				vm.syncPath.IsInvAcct=true;
			}else{	
				vm.showAccounttype = true;
				vm.syncPath.IsInvAcct=false;
			}			
		};

        vm.destroy = function(){
            destWatch();
        };

        //Property map methods start

         vm.savePropertyMap = function(row, rowForm){            
            vm.editcountPropertyMap = 0;            
            model.save(row, rowForm);
            vm.enableAddPropertyMap=false;
           /* if(row.isNew == 1){
                vm.globalPropertyMap.push(row);
            }*/
        }; 

        vm.editPropertyMap = function(row, rowForm){
            if(vm.editcountPropertyMap==0){
                vm.originalRow = angular.copy(row);
                vm.rowform= angular.copy(rowForm);
                vm.editcountPropertyMap=1;
            }else{
                 row.isEditing=false;
                  $("#PropertyMapValid").show('fade');
                    setTimeout(function(){
                        $("#PropertyMapValid").hide('fade');
                    },2000);
                    $("#PropertyMapclose").click(function(){
                        $("#PropertyMapValid").hide('fade');
                  });
            }      
        };        

         vm.cancelPropertyMap = function(row, rowForm){            
            vm.editcountPropertyMap=0;
            model.cancel(row, rowForm,vm.originalRow);   
            if(vm.enableAddPropertyMap){
                model.entityMapGridConfig.settings().dataset.splice(0,1);
                model.entityMapGridConfig.sorting({});
                model.entityMapGridConfig.page(1);
                model.entityMapGridConfig.reload();
                vm.model=model;
                vm.enableAddPropertyMap=false;
            }          
        };

         vm.deletePropertyMap = function(row){  
            model.entityMapGridConfig.settings().dataset.splice(model.entityMapGridConfig.data.indexOf(row),1);
            model.entityMapGridConfig.sorting({});
            model.entityMapGridConfig.page(1);
            model.entityMapGridConfig.reload();
            vm.model=model;
        }; 


         vm.addPropertyMap = function(){
          vm.editcountPropertyMap=1;
            vm.enableAddPropertyMap=true;
            model.entityMapGridConfig.settings().dataset.unshift({
                EntityDomainCode: "Property",
                SourceSyncID1: null,
                SourceSyncID2: null,
                TargetSyncID:null,
                isNew:1,
                isEditing:true
            });
            model.entityMapGridConfig.sorting({});
            model.entityMapGridConfig.page(1);
            model.entityMapGridConfig.reload();
         };

        //Property map methods end

         //Account type methods start

         vm.saveAccountType = function(row, rowForm){            
            vm.editcountAccountType = 0;            
            model.save(row, rowForm);
            vm.enableAddAccountType=false;
            /*if(row.isNew == 1){
                vm.globalAccountType.push(row);
            }*/
        }; 

         vm.addAccountType = function(){
          vm.editcountAccountType = 1;
            vm.enableAddAccountType=true;
            model.accountTypeGridConfig.settings().dataset.unshift({
                AccountType: "Select Account Type",
                GLFrom: null,
                GLTo: null,
                ActualSignFlip: false,
                BudgetSignFlip: false,
                isNew:1,
                isEditing:true
            });
            model.accountTypeGridConfig.sorting({});
            model.accountTypeGridConfig.page(1);
            model.accountTypeGridConfig.reload();
         };

        vm.deleteAccountType = function(row){  
            model.accountTypeGridConfig.settings().dataset.splice(model.accountTypeGridConfig.data.indexOf(row),1);
            model.accountTypeGridConfig.sorting({});
            model.accountTypeGridConfig.page(1);
            model.accountTypeGridConfig.reload();
            vm.model=model;
        }; 
        vm.cancelAccountType = function(row, rowForm){            
            vm.editcountAccountType = 0;
            model.cancel(row, rowForm, vm.originalRowAccountType);   
            if(vm.enableAddAccountType){
                model.accountTypeGridConfig.settings().dataset.splice(0,1);
                model.accountTypeGridConfig.sorting({});
                model.accountTypeGridConfig.page(1);
                model.accountTypeGridConfig.reload();
                vm.model=model;
                vm.enableAddAccountType=false;
            }          
        };

         vm.editAccountType = function(row, rowForm){
            if(vm.editcountAccountType == 0){
                vm.originalRowAccountType = angular.copy(row);
                vm.rowform= angular.copy(rowForm);
                vm.editcountAccountType = 1;
            }else{
                 row.isEditing=false;
                  $("#AccountTypeValid").show('fade');
                    setTimeout(function(){
                        $("#AccountTypeValid").hide('fade');
                    },2000);
                    $("#AccountTypeclose").click(function(){
                        $("#AccountTypeValid").hide('fade');
                  });
            }      
        }; 
       //Account type methods end

       //Entity Domain methods start

        vm.saveEntityDomain = function(row, rowForm){            
            vm.editcountEntityDomain = 0;            
            model.save(row, rowForm);
            vm.enableAddEntityDomain=false;
            /*if(row.isNew == 1){
                vm.globalEntityDomain.push(row);
            }*/
        }; 

        vm.addEntityDomain = function(){
            vm.editcountEntityDomain=1;
            vm.enableAddEntityDomain=true;
            model.entityDomainGridConfig.settings().dataset.unshift({
                EntityDomainCode: "Select Code",
                SyncSequence: null,
                IsPrimaryDomain: false,
                isNew:1,
                isEditing:true
            });
            model.entityDomainGridConfig.sorting({});
            model.entityDomainGridConfig.page(1);
            model.entityDomainGridConfig.reload();
         };

         vm.cancelEntityDomain = function(row, rowForm){            
            vm.editcountEntityDomain=0;
            model.cancel(row, rowForm,vm.originalRowEntityDomain);   
            if(vm.enableAddEntityDomain){
                model.entityDomainGridConfig.settings().dataset.splice(0,1);
                model.entityDomainGridConfig.sorting({});
                model.entityDomainGridConfig.page(1);
                model.entityDomainGridConfig.reload();
                vm.model=model;
                vm.enableAddEntityDomain=false;
            }          
        };

         vm.deleteEntityDomain = function(row){  
            model.entityDomainGridConfig.settings().dataset.splice(model.entityDomainGridConfig.data.indexOf(row),1);
            model.entityDomainGridConfig.sorting({});
            model.entityDomainGridConfig.page(1);
            model.entityDomainGridConfig.reload();
            vm.model=model;
        }; 

        vm.cancelEntityDomain = function(row, rowForm){            
            vm.editcountEntityDomain=0;
            model.cancel(row, rowForm, vm.originalRowEntityDomain);   
            if(vm.enableAddEntityDomain){
                model.entityDomainGridConfig.settings().dataset.splice(0,1);
                model.entityDomainGridConfig.sorting({});
                model.entityDomainGridConfig.page(1);
                model.entityDomainGridConfig.reload();
                vm.model=model;
                vm.enableAddEntityDomain=false;
            }          
        };

         vm.editEntityDomain = function(row, rowForm){
            if(vm.editcountEntityDomain==0){
                vm.originalRowEntityDomain = angular.copy(row);
                vm.rowform= angular.copy(rowForm);
                vm.editcountEntityDomain = 1;
            }else{
                 row.isEditing=false;
                  $("#EntityDomainValid").show('fade');
                    setTimeout(function(){
                        $("#EntityDomainValid").hide('fade');
                    },2000);
                    $("#EntityDomainclose").click(function(){
                        $("#EntityDomainValid").hide('fade');
                  });
            }      
        }; 

        //Entity Domain methods end


        //Package Account type methods start

         vm.savePackageAccountTypeConfig = function (row, rowForm) {
             vm.editcountPackageAccountTypeConfig = 0;
             model.save(row, rowForm);
             vm.enablePackageAccountTypeConfig = false;
         };

         vm.editPackageAccountTypeConfig = function (row, rowForm) {
             if (vm.editcountPackageAccountTypeConfig == 0) {
                 vm.originalRow = angular.copy(row);
                 vm.rowform = angular.copy(rowForm);
                 vm.editcountPackageAccountTypeConfig = 1;
             } else {
                 row.isEditing = false;
                 $("#PackageAccountTypeConfigValid").show('fade');
                 setTimeout(function () {
                     $("#PackageAccountTypeConfigValid").hide('fade');
                 }, 2000);
                 $("#PackageAccountTypeConfigclose").click(function () {
                     $("#PackageAccountTypeConfigValid").hide('fade');
                 });
             }
         };

         vm.cancelPackageAccountTypeConfig = function (row, rowForm) {
             vm.editcountPackageAccountTypeConfig = 0;
             model.cancel(row, rowForm, vm.originalRow);
             if (vm.enablePackageAccountTypeConfig) {
                 model.PackageAccountTypeGridConfig.settings().dataset.splice(0, 1);
                 model.PackageAccountTypeGridConfig.sorting({});
                 model.PackageAccountTypeGridConfig.page(1);
                 model.PackageAccountTypeGridConfig.reload();
                 vm.model = model;
                 vm.enablePackageAccountTypeConfig = false;
             }
         };

         vm.deletePackageAccountTypeConfig = function (row) {
             model.PackageAccountTypeGridConfig.settings().dataset.splice(model.PackageAccountTypeGridConfig.data.indexOf(row), 1);
             model.PackageAccountTypeGridConfig.sorting({});
             model.PackageAccountTypeGridConfig.page(1);
             model.PackageAccountTypeGridConfig.reload();
             vm.model = model;
         };


         vm.addPackageAccountTypeConfig = function () {
             vm.editcountPackageAccountTypeConfig = 1;
             vm.enablePackageAccountTypeConfig = true;
             model.PackageAccountTypeGridConfig.settings().dataset.unshift({
                 GLFrom: null,
                 GLTo: null,
                 SignFlip: false,
                 PositiveValue: null,
                 NegativeValue: null,
                 isNew: 1,
                 isEditing: true
             });
             model.PackageAccountTypeGridConfig.sorting({});
             model.PackageAccountTypeGridConfig.page(1);
             model.PackageAccountTypeGridConfig.reload();
         };

        //Package Account type methods end

        //Sync Config methods start

         vm.saveSyncConfig = function (row, rowForm) {
             vm.editcountSyncConfig = 0;
             model.save(row, rowForm);
             vm.enableSyncConfig = false;
         };

         vm.editSyncConfig = function (row, rowForm) {
             if (vm.editcountSyncConfig == 0) {
                 vm.originalRow = angular.copy(row);
                 vm.rowform = angular.copy(rowForm);
                 vm.editcountSyncConfig = 1;
             } else {
                 row.isEditing = false;
                 $("#SyncConfigValid").show('fade');
                 setTimeout(function () {
                     $("#SyncConfigValid").hide('fade');
                 }, 2000);
                 $("#SyncConfigclose").click(function () {
                     $("#SyncConfigValid").hide('fade');
                 });
             }
         };

         vm.cancelSyncConfig = function (row, rowForm) {
             vm.editcountSyncConfig = 0;
             model.cancel(row, rowForm, vm.originalRow);
             if (vm.enableSyncConfig) {
                 model.SyncConfigGridConfig.settings().dataset.splice(0, 1);
                 model.SyncConfigGridConfig.sorting({});
                 model.SyncConfigGridConfig.page(1);
                 model.SyncConfigGridConfig.reload();
                 vm.model = model;
                 vm.enableSyncConfig = false;
             }
         };

         vm.deleteSyncConfig = function (row) {
             model.SyncConfigGridConfig.settings().dataset.splice(model.SyncConfigGridConfig.data.indexOf(row), 1);
             model.SyncConfigGridConfig.sorting({});
             model.SyncConfigGridConfig.page(1);
             model.SyncConfigGridConfig.reload();
             vm.model = model;
         };


         vm.addSyncConfig = function () {
             vm.editcountSyncConfig = 1;
             vm.enableSyncConfig = true;
             model.SyncConfigGridConfig.settings().dataset.unshift({
                 ConfigName: null,
                 ConfigValue: null,
                 isNew: 1,
                 isEditing: true
             });
             model.SyncConfigGridConfig.sorting({});
             model.SyncConfigGridConfig.page(1);
             model.SyncConfigGridConfig.reload();
         };

        //Sync Config methods end


        //Setting Tab
         vm.setTab = function(newTab){
            vm.tab = newTab;
         };

       vm.isSet = function(tabNum){
            return vm.tab === tabNum;
        }; 
         
        vm.validate = function(form){
           svc.validateSyncPathCode(vm.syncPath.SyncPathCode,vm.syncPath.SyncPathID).then(function(response){
                vm.showSyncPathCodeValidation= response.data.Data == "0" ? false:true;
                if(vm.showSyncPathCodeValidation){
                     $("#syncPathcodeValid").show('fade');
                    setTimeout(function(){
                        $("#syncPathcodeValid").hide('fade');
                    },2000);
                    $("#syncPathcodeclose").click(function(){
                        $("#syncPathcodeValid").hide('fade');
                    });
                }else{
                    vm.Save(form);
                }
            },function(response){
                 vm.model.errorData=response;
            });
        };

        vm.submitForm = function(form){
            vm.submitted=true;
            if(SyncPathForm.checkValidity()){
                vm.validate(form);
            }else{  
                 $("#formAlert").show('fade');
                    setTimeout(function(){
                        $("#formAlert").hide('fade');
                    },2000);
                    $("#linkclose").click(function(){
                        $("#formAlert").hide('fade');
                  });
            }
        };
        vm.Save=function(form){
            var dataf=vm.syncPath;
            vm.syncObj= model.assignDataToSyncObject(vm.syncPath,model.entityMapGridConfig._settings.dataset,model.accountTypeGridConfig._settings.dataset,model.entityDomainGridConfig._settings.dataset,model.SyncConfigGridConfig._settings.dataset,model.PackageAccountTypeGridConfig._settings.dataset);
                svc.addSyncPathNew(vm.syncObj.syncObjec).then(function(response){
                        alert("Success");
                         model.setEntityMapData([]);
                         model.setAccountTypeConfigData([]);
                         model.setEntityDomainData([]);
                    },function(response){
                        alert("failed");
                });
            vm.syncPath={};
            form.$setPristine();
            vm.submitted=false;
        }
  
        vm.init();
    }
})
(angular);