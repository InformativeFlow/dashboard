'use strict';
angular.module('app')
        .controller('extrasCtrl', extrasCtrl);

extrasCtrl.$inject = ['$scope', '$http'];
function extrasCtrl($scope, $http) {

    $scope.sizeImages = {};
    $scope.sizeVideos = {};

    $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image').then(function (response) {
        $scope.sizeImages = response.data.Items.length;
    });
    $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video').then(function (response) {

        $scope.sizeVideos = response.data.Items.length;
    });

}