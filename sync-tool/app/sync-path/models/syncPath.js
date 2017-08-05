(function (angular) {

    angular
        .module('app')
        .factory("app.syncPathModel", [
            'NgTableParams',
            factory]);

    function factory(tableParams) {
          function syncPathModel(){
                var s = this;
                s.init();
            };
        var p = syncPathModel.prototype;

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

        p.setSyncPathData=function(data){
            var system=this;
            system.gridSyncPathConfig=new tableParams({}, { dataset: data});
            system.gridSyncPathConfig._settings.counts=[];
            return system;
        };

        p.setTab = function(newTab){
         p.tab = newTab;
        };
        
        return syncPathModel;
    }
})
(angular);