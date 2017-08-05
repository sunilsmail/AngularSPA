(function (angular) {

    angular
        .module('app')
        .factory("app.dashboardModel", [
            'NgTableParams',
            factory]);

    function factory(tableParams) {
        function dashboardModel(){
            var s = this;
            s.init();
        };

        var p = dashboardModel.prototype;

        p.init = function () {
            var s = this;
            s.title = "Dashboard";
            return s;
        };

        p.setData = function(data){
            var s = this;
            s.gridConfig = new tableParams({}, { dataset: data});
            return s;
        };

        
        p.setSyncSummary =function(data){
            var s = this;
            s.SyncSummarygridConfig = new tableParams({}, { dataset: data});
            s.SyncSummarygridConfig._settings.counts=[];
            return s;
        };
        
        return dashboardModel;
    }
})
(angular);