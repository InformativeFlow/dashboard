'use strict';
angular.module('app')
        .controller('screenCtrl', screenCtrl)
        .controller('ModalInstanceCtrl', ModalInstanceCtrl);

screenCtrl.$inject = ['$scope', '$http', '$state', '$q', '$uibModal'];
function screenCtrl($scope, $http, $state, $q, $uibModal) {


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

            }
        }

    });

    $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image').then(function (response) {
        $scope.contentImages = response.data.Items;

    });
    $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video').then(function (response) {

        $scope.contentVideos = response.data.Items;
    });


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
                console.lod(JSON.stringify(response.data));
            });
          
        }
    };

    $scope.deleteContent = function () {
        $scope.list4 = [];

    }
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
ModalInstanceCtrl.$inject = ['$scope', '$http', '$uibModalInstance', '$q', '$uibModal'];
function ModalInstanceCtrl($scope, $http, $uibModalInstance, $q, $uibModal) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}