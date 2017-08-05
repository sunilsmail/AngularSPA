(function (angular) {

    angular
        .module('app')
        .factory("app.syncSystemdModel", [
            'NgTableParams',
            factory]);

    function factory(tableParams,$d) {
        function syncSystemdModel(){
            var s = this;
            s.init();
        };

        var p = syncSystemdModel.prototype;

        p.init = function () {
            var s = this;
            s.title = "Sync Systems";
            return s;
        };
        p.invalidCellsByRow = [];
        p.dirtyCellsByRow = [];
        p.originalRow=[];
        p.setData = function(data){
            var s = this;
            p.originalRow=angular.copy(data);
            s.gridConfig = new tableParams({}, { dataset: data});
            s.gridConfig._settings.counts=[]; //To disable page sizes
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

        return syncSystemdModel;
    }
})
(angular);