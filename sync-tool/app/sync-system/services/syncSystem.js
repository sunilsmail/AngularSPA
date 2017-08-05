(function (angular) {

    angular
        .module('app')
        .factory("app.syncSystemService", ['$http','ServiceUrl', factory]);

    function factory($http,ServiceUrl) {
        function syncSystemService(){
            var s = this;
            s.init();
        };

        var p = syncSystemService.prototype;

        p.init = function(){
            var s = this;
            return s;
        };

        p.getSyncSystem = function () {
            var syncSystem = this;
            syncSystem.url=ServiceUrl.Url+'/SyncSystem/GetSyncSystem';
            return $http({
                method: 'GET',
                data: 'json',
                url:  syncSystem.url
            });
        }; 

          p.generateBathFiles = function () {
            var syncSystem = this;
            syncSystem.url=ServiceUrl.Url+'/SyncLog/GenerateBatchFiles';
            return $http({
                method: 'GET',
                data: 'json',
                url:  syncSystem.url
            });
        }; 

        p.updateSyncSystem = function (request) {
           var syncSystem = this;
           syncSystem.url=ServiceUrl.Url+'/SyncSystem/UpdateSyncSystemById';
           syncSystem.serializedData = {"Id":request.Id,"RetryInterval":request.RetryInterval,"RetryCount":request.RetryCount,"SysCode":"","SysName":""};
            return $http({
                method: 'POST',
                data: syncSystem.serializedData,
                headers: {"Content-Type":"application/json"},
                url: syncSystem.url
            });
        }; 

        p.downLoadBatchLog = function () {
             var logs=this;
             logs.url=ServiceUrl.Url+'/SyncLog/DownloadBatchFile';
            return $http({
                method: 'GET',
                data: 'json',
                url: logs.url,
                responseType: 'arraybuffer'
            });
        }; 

        p.get = function () {
            var s = this;            
            // Call's Web API using $http or $resource

            return [{"id":1,"name":"Nissim","age":41,"money":454},{"id":2,"name":"Mariko","age":10,"money":-100},{"id":3,"name":"Mark","age":39,"money":291},{"id":4,"name":"Allen","age":85,"money":871},{"id":5,"name":"Dustin","age":10,"money":378},{"id":6,"name":"Macon","age":9,"money":128},{"id":7,"name":"Ezra","age":78,"money":11},{"id":8,"name":"Fiona","age":87,"money":285},{"id":9,"name":"Ira","age":7,"money":816},{"id":10,"name":"Barbara","age":46,"money":44},{"id":11,"name":"Lydia","age":56,"money":494},{"id":12,"name":"Carlos","age":80,"money":193}];
        };
        
        return new syncSystemService();
    }
})
(angular);