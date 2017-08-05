(function (angular) {

    angular
        .module('app')
        .factory("app.syncPathNewModel", [
            'NgTableParams',
            factory]);

    function factory(tableParams) {
          function syncPathNewModel(){
                var s = this;
                s.init();
            };
        var p = syncPathNewModel.prototype;

        p.init = function () {
            var s = this;
            s.title = "Dashboard";
            s.tab = 1;
            return s;
        };

        p.setData = function(data){
            var s = this;
            s.gridConfig = new tableParams({}, { dataset: data});
            return s;
        };

         p.setEntityMapData = function(entityDatadata){
            var s = this;
            s.entityMapGridConfig = new tableParams({}, { dataset: entityDatadata});
            s.entityMapGridConfig._settings.counts=[];
            return s;
        };

        p.setAccountTypeConfigData = function(AccountTypedata){
            var s = this;
            s.accountTypeGridConfig = new tableParams({}, { dataset: AccountTypedata});
            s.accountTypeGridConfig._settings.counts=[];
            return s;
        };

         p.setEntityDomainData = function(EntityDomainData){
            var s = this;
            s.entityDomainGridConfig = new tableParams({}, { dataset: EntityDomainData});
            s.entityDomainGridConfig._settings.counts=[];
            return s;
         };

        //Added for Package account type config
         p.setPackageAccountTypeConfigData = function (PackageAccountTypeData) {
             var s = this;
             s.PackageAccountTypeGridConfig = new tableParams({}, { dataset: PackageAccountTypeData });
             s.PackageAccountTypeGridConfig._settings.counts = [];
             return s;
         };

        //Added for Sync Config
         p.setSyncConfigData = function (SyncConfigData) {
             var s = this;
             s.SyncConfigGridConfig = new tableParams({}, { dataset: SyncConfigData });
             s.SyncConfigGridConfig._settings.counts = [];
             return s;
         };


        p.cancel=function(row, rowForm,originalRowd){
            var originalRow =p.resetRow(row, rowForm);
            p.originalRow=originalRowd;
            p.originalRow.isEditing = false;
            angular.extend(row, p.originalRow);
        };

         p.save = function(row, rowForm){
            var originalRow =p.resetRow(row, rowForm);
            p.originalRow=row;
            p.originalRow.isEditing = false;
            angular.extend(row, p.originalRow);            
        };

         p.resetRow = function(row, rowForm){
            row.isEditing = false;
            rowForm.$setPristine();
        };
        p.setSyncSystemData=function(data){
            var sync=this;
            sync.data=data;
            return sync;
        }
        p.assignDataToSyncObject = function(syncObj,EntityMap,AccountTypeConfig,EntityDomain,SyncConfig,PackageAccountTypeConfig){
            var syncpath=this;
           syncpath.syncPathobj= {
                                    "SyncPathCode": syncObj.SyncPathCode,
                                    "SourceSystem": syncObj.Source,
                                    "TargetSystem": syncObj.Target,
                                    "SourceCompanyID": syncObj.SourceCompanyId,
                                    "TargetCompanyID": syncObj.TargetCompanyId,
                                    "SourceSysURL": syncObj.SourceURL,
                                    "TargetSysURL": syncObj.TargetURL,
                                    "AutoSyncProperty": syncObj.AutoSync,
                                    "NextSyncTime": syncObj.SyncInterval,
                                    "SyncInterval": syncObj.NextSyncTime,
                                    "SyncPathID": syncObj.SyncPathID,
                                    "IsMultiEntityClient":syncObj.IsMultiEntityClient,
									"IsInvAcct":syncObj.IsInvAcct
                                };
             syncpath.syncObjec = {"SyncPath":syncpath.syncPathobj,"lstEntityMap":EntityMap,"lstAccountTypeConfig":AccountTypeConfig,"lstEntityDomain":EntityDomain,"lstSyncConfig":SyncConfig,"lstPackageAccountTypeConfig":PackageAccountTypeConfig}
             return syncpath;
        }
        p.setSyncPathData=function(data){
            var system=this;
            system.gridSyncPathConfig=new tableParams({}, { dataset: data});
            return system;
        };

        p.setTab = function(newTab){
         p.tab = newTab;
        };
        
        return syncPathNewModel;
    }
})
(angular);