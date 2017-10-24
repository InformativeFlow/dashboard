'use strict';
angular.module('app')
        .controller('displayCtrl', displayCtrl);

displayCtrl.$inject = ['$scope', '$http', '$state'];
function displayCtrl($scope, $http, $state) {

    $scope.urlDisplay = $state.params.url;
    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch').then(function (response) {

        $scope.data = response.data.Items;

        for (var item in $scope.data) {
            for(var screen in $scope.data[item].screens["L"] )
            if ($scope.data[item].screens["L"][screen]["M"].url["S"] == $scope.urlDisplay) {
                $scope.video = $scope.data[item].screens["L"][screen]["M"].video["S"];
                console.log("video "+$scope.video);
            }
        }
        if ($scope.video) {
        } else {
            $state.go('appSimple.404', {}, {reload: true});
        }

    });

}