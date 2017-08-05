(function (angular) {

    angular
        .module('app')
        .factory("app.syncPathNewService", ['$http','ServiceUrl', factory]);

    function factory($http,ServiceUrl) {
        function syncPathNewService(){
            var s = this;
            s.init();
        };

        var p = syncPathNewService.prototype;

        p.init = function(){
            var s = this;
            return s;
        };

        p.getSyncPathData=function(){
            var sync = this;
            sync.url=ServiceUrl.Url+'/SyncPath/GetSyncPath';
             return $http({
                method: 'GET',
                data: 'json',
                url: sync.url
            });
        };

         p.validateSyncPathCode=function(syncPathCodet,SyncPathId){
            var sync = this;
            if(SyncPathId==undefined){
                SyncPathId=0;
            }
            sync.url=ServiceUrl.Url+'/SyncPath/ValidateSyncPathCode';
             return $http({
                method: 'GET',
                data: 'json',
                params:{syncPathCode:syncPathCodet,syncpathid:SyncPathId},
                url: sync.url
            });
        };

        p.getEntityMap=function(syncpathid){
            var sync = this;
            sync.url=ServiceUrl.Url+'/EntityMap/EntityMap/'+syncpathid
             return $http({
                method: 'GET',
                data: 'json',
                url: sync.url
            });
        };

         p.addSyncPathNew = function (request) {
            var sync = this;
            sync.url=ServiceUrl.Url+'/SyncPath/AddSyncPathData';
            sync.serializedData = request;
            return $http({
                method: 'POST',
                data: sync.serializedData,
                headers: {"Content-Type":"application/json"},
                url: sync.url
            });
        }; 


        p.getAccountTypeConfig = function (syncpathid) {
            var sync = this;
            sync.url=ServiceUrl.Url+'/SyncPath/AccountTypeConfig/'+syncpathid;
             return $http({
                method: 'GET',
                data: 'json',
                url: sync.url
            });
        }; 

        p.getEntityDomain = function (syncpathid) {
            var sync = this;
            sync.url=ServiceUrl.Url+'/SyncPath/EntityDomain/'+syncpathid;
             return $http({
                method: 'GET',
                data: 'json',
                url: sync.url
            });
        };

        p.getSyncPathData=function(syncpathid){
            var s=this;
            s.url=ServiceUrl.Url+'SyncPath/SyncPath/0/0/'+syncpathid;
             return $http({
                method: 'GET',
                data: 'json',
                url: s.url
            });
        };

        p.getPackageAccountTypeConfig = function (syncpathid) {
            var s = this;
            s.url = ServiceUrl.Url + 'SyncPath/PackageAccountTypeConfig/' + syncpathid;
            return $http({
                method: 'GET',
                data: 'json',
                //url: s.url
                url: s.url 
            });
        };

        p.getSyncConfig = function (syncpathid) {
            var s = this;
            s.url = ServiceUrl.Url + 'SyncPath/SyncConfig/' + syncpathid;
            return $http({
                method: 'GET',
                data: 'json',
                url: s.url
            });
        };

        p.get = function () {
            var s = this;
            // Call's Web API using $http or $resource

            return [{"id":1,"name":"Nissim","age":41,"money":454},{"id":2,"name":"Mariko","age":10,"money":-100},{"id":3,"name":"Mark","age":39,"money":291},{"id":4,"name":"Allen","age":85,"money":871},{"id":5,"name":"Dustin","age":10,"money":378},{"id":6,"name":"Macon","age":9,"money":128},{"id":7,"name":"Ezra","age":78,"money":11},{"id":8,"name":"Fiona","age":87,"money":285},{"id":9,"name":"Ira","age":7,"money":816},{"id":10,"name":"Barbara","age":46,"money":44},{"id":11,"name":"Lydia","age":56,"money":494},{"id":12,"name":"Carlos","age":80,"money":193}];
        };
        
        return new syncPathNewService();
    }
})
(angular);