'use strict';
angular.module('app')
        .controller('branchesCtrl', branchesCtrl);

branchesCtrl.$inject = ['$scope', '$http'];
function branchesCtrl($scope, $http) {
  
    $scope.branches = [];
    $http.get('data/branches.json').then(function (response) {
        $scope.branches = response.data;
    });

}

