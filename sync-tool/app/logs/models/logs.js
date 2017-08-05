(function (angular) {

    angular
        .module('app')
        .factory("app.logModel", [
            'NgTableParams',
            factory]);

    function factory(tableParams,$d) {
        function logModel(){
            var s = this;
            s.init();
        };

        var p = logModel.prototype;

        p.init = function () {
            var s = this;
            s.title = "Sync System";
            return s;
        };
        p.invalidCellsByRow = [];
        p.dirtyCellsByRow = [];
        p.originalRow=[];
        p.setData = function(data){
            var s = this;
            p.originalRow=angular.copy(data);
            s.gridConfig = new tableParams({}, { dataset: data});
            return s;
        };

        p.setLogFilesData= function(data){
            var s = this;
            p.originalRow=angular.copy(data);
            s.LogFilesgridConfig = new tableParams({}, { dataset: data});
            s.LogFilesgridConfig._settings.counts=[];//Hiding page sizes
            return s;
        }
        p.setSyncLogData = function(data){
            var s = this;           
            s.syncLogGridConfig = new tableParams({}, { dataset: data});
            s.syncLogGridConfig._settings.counts=[];//Hiding page sizes
            return s;
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


         p.cancel=function(row, rowForm,originalRowd){
            var originalRow =p.resetRow(row, rowForm);
            p.originalRow=originalRowd;
            p.originalRow.isEditing = false;
            angular.extend(row, p.originalRow);
        };
                
        
        p.setInvalid = function(isInvalid){            
            p.$invalid = isInvalid;
            p.$valid = !isInvalid;
        };

        p.add=function(){
            p.isEditing=true;
            p.isAdding=true;           
        };

        return logModel;
    }
})
(angular);