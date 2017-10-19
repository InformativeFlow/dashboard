'use strict';
angular.module('app')
        .controller('screenCtrl', screenCtrl);

screenCtrl.$inject = ['$scope', '$http', '$state', '$q'];
function screenCtrl($scope, $http, $state, $q) {


    $scope.branchId = $state.params.branchId;
    $scope.screenId = $state.params.screenId;

    $scope.screens = [];
    $scope.screensBranch = [];
    $scope.contentImages = [];
    $scope.contentVideos = [];
    $scope.list4 = [];

    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch').then(function (response) {

        $scope.screens = response.data.Items;
        for (var item in $scope.screens) {
            if ($scope.screens[item].id["N"] == $scope.branchId) {
                $scope.branchSelectedName = $scope.screens[item].name["S"];
                $scope.screensBranch = $scope.screens[item].screens["L"];
                for (var screen in $scope.screensBranch) 
                    if ($scope.screensBranch[screen]["M"].id["N"] == $scope.screenId) 
                        for (var content in $scope.screensBranch[screen]["M"].content["L"])
                            $scope.list4.push($scope.screensBranch[screen]["M"].content["L"][content]["M"]);
                }
            }
    });

    $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image').then(function (response) {
        $scope.contentImages = response.data.Items;
    });

    $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video').then(function (response) {
        $scope.contentVideos = response.data.Items;
    });

    /*
     * Método que retorna el contenido asociado a una pantalla.
     * Se envia el id de la pantalla y se espera recibir un array como el que retorna el siguiente servicio
     * @returns {Boolean}
     * 
     */

    $scope.hideMe = function () {
        return $scope.list4.length > 0;
    };

    $scope.saveContent = function () {

        if ($scope.list4.length > 0) {
            var mapbuilder = {};
            $scope.listReady = [];
            for (var item in $scope.list4) {
                delete $scope.list4[item]["$$hashKey"];
                mapbuilder["M"] = $scope.list4[item];
                $scope.listReady.push(mapbuilder);
            }
            var idx = $scope.screenId - 1;
            var params = {
                "TableName": "branch",
                "Key": {
                    "name": {
                        "S": $scope.branchSelectedName
                    }
                },
                "UpdateExpression": "SET #ri[" + idx + "].content = list_append( #ri[" + idx + "].content,:vals)",
                "ExpressionAttributeNames": {"#ri": "screens"},
                "ExpressionAttributeValues": {
                    ":vals": {"L": $scope.listReady}
                }
            };

            $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', params).then(function (response) {

            });

        }
    };

    $scope.deleteContent = function () {

        $scope.list4 = [];

    };

    $scope.list2 = {};

    $scope.beforeDrop = function () {

        var deferred = $q.defer();
        //  if (confirm('¿Desea borrar el contenido?')) {
        $scope.list2 = {};
        deferred.resolve();
        // } else {
        //   deferred.reject();
        //}
        return deferred.promise;
    };

}
