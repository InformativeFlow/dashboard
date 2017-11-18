'use strict';
angular.module('app')
        .controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$scope', '$http', '$location', '$auth','configService'];
function loginCtrl($scope, $http, $location, $auth,configService) {

    $scope.user = {};

    $scope.login = function () {
        $http.get('data/user.json').then(function (data) {

            $auth.setToken("iflowtoken8650");
            $location.path('/dashboard');
            
        }).catch(function (error) {
            console.log(error);
        })
    };

}