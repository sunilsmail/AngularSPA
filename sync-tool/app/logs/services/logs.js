(function (angular) {

    angular
        .module('app')
        .factory("app.logService", ['$http','ServiceUrl', factory]);

    function factory($http,ServiceUrl) {    
        function logService(){
            var s = this;
            s.init();
        };

        var p = logService.prototype;

        p.init = function(){
            var s = this;
            return s;
        };

        p.getSyncSystem = function () {
             var logs=this;
             logs.url=ServiceUrl.Url+'/SyncSystem/GetSyncSystem';
            return $http({
                method : 'GET',
                data : 'json',
                url : logs.url
            });
        }; 

         p.getSyncLog = function (syncpathid,startDate,endDate) {
             var logs=this;
             logs.url=ServiceUrl.Url+'/SyncLog/SyncLog';
            return $http({
                method: 'GET',
                data: 'json',
                url: logs.url,
                params: {syncpathid: syncpathid,startdate:startDate,enddate:endDate}
            });
        }; 

         p.getSyncPathCode=function(row){
            var s=this;
            s.syncSelectedRow=row;
            return s;
        }
         p.setSyncPath=function(data){
             var s=this;
            s.syncPathData=data;
            return s;
        }

         p.getSyncLogFiles = function (Syncid) {
             var logs=this;
             logs.url=ServiceUrl.Url+'/SyncLog/GetFile';
            return $http({
                method: 'GET',
                data: 'json',
                url: logs.url,
                params: {code: Syncid}
            });
        }; 

        p.downLoadLog = function (FileName) {
             var logs=this;
             logs.url=ServiceUrl.Url+'/SyncLog/DownloadLog';
            return $http({
                method: 'GET',
                data: 'json',
                url: logs.url,
                responseType: 'arraybuffer',
                params: {fileName: FileName}
            });
        }; 

        p.updateSyncSystem = function (request) {
          var logs=this;
          logs.serializedData = {"Id":request.Id,"RetryInterval":request.RetryInterval,"RetryCount":request.RetryCount,"SysCode":"","SysName":""};
          logs.url = ServiceUrl.Url+'/SyncSystem/UpdateSyncSystemById';
            return $http({
                method: 'POST',
                data: logs.serializedData,
                headers: {"Content-Type":"application/json"},
                url: logs.url
            });
        }; 
        p.get = function () {
            var s = this;            
            // Call's Web API using $http or $resource

            return [{"id":1,"name":"Nissim","age":41,"money":454},{"id":2,"name":"Mariko","age":10,"money":-100},{"id":3,"name":"Mark","age":39,"money":291},{"id":4,"name":"Allen","age":85,"money":871},{"id":5,"name":"Dustin","age":10,"money":378},{"id":6,"name":"Macon","age":9,"money":128},{"id":7,"name":"Ezra","age":78,"money":11},{"id":8,"name":"Fiona","age":87,"money":285},{"id":9,"name":"Ira","age":7,"money":816},{"id":10,"name":"Barbara","age":46,"money":44},{"id":11,"name":"Lydia","age":56,"money":494},{"id":12,"name":"Carlos","age":80,"money":193}];
        };
        
        return new logService();
    }
})
(angular);