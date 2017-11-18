'use strict';
angular.module('app')
        .controller('branchesCtrl', branchesCtrl);

branchesCtrl.$inject = ['$scope', '$http','configService'];
function branchesCtrl($scope, $http,configService) {

    $scope.branches = [];
    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', configService.getConfig()).then(function (response) {

        $scope.branches = response.data.Items;

    });


}

