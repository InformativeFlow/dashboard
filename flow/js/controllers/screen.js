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

    $http.get('data/branches.json').then(function (response) {
        $scope.screens = response.data;
        for (var item in $scope.screens) {
            if ($scope.screens[item].id == $scope.branchId) {
                $scope.screensBranch = $scope.screens[item].screens;
            }
        }
    });

    $http.get('data/images.json').then(function (response) {
        $scope.contentImages = response.data;


    });
    $http.get('data/videos.json').then(function (response) {

        $scope.contentVideos = response.data;
    });


    $scope.hideMe = function () {
        return $scope.list4.length > 0;
    }

    $scope.saveContent = function () {

        if ($scope.list4.length > 0) {
            $http.post('api/content/save', [$scope.list4, {"branchId": $scope.branchId}, {"screenId": $scope.screenId}]).then(function (response) {

            });
        }
    }

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