'use strict';
angular.module('app')
        .controller('extrasCtrl', extrasCtrl);

extrasCtrl.$inject = ['$scope', '$http', 'configService'];
function extrasCtrl($scope, $http, configService) {

    $scope.sizeImages = 0;
    $scope.sizeVideos = 0;
    $scope.sizePrmotions = 0;


    $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image', configService.getConfig()).then(function (res) {

        for (var item in  res.data.Items) {
            if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString())
                $scope.sizeImages++;
        }

    });
    $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video', configService.getConfig()).then(function (res) {

        for (var item in  res.data.Items) {
            if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString())
                $scope.sizeVideos++;
        }
        
    });
    
    $http.get('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios?TableName=promotion', configService.getConfig()).then(function (res){

        for (var item in  res.data.Items) {
            if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString())
                $scope.sizePrmotions++;
        }
        
    });

}