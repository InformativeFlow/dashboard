'use strict';
angular.module('app')
        .controller('displayCtrl', displayCtrl);

displayCtrl.$inject = ['$scope', '$http', '$state'];
function displayCtrl($scope, $http, $state) {

    $scope.urlDisplay = $state.params.url;
    $http.get('data/urls.json').then(function (response) {

        $scope.data = response.data;

        for (var item in $scope.data) {
            if ($scope.data[item].url == $scope.urlDisplay) {
                $scope.video = $scope.data[item].video;
                console.log("video "+$scope.video);
            }
        }
        if ($scope.video) {
        } else {
            $state.go('appSimple.404', {}, {reload: true});
        }

    });

}