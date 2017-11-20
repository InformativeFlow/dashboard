'use strict';
angular.module('app')
        .controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$scope', '$http', '$location', '$auth', 'configService'];
function loginCtrl($scope, $http, $location, $auth, configService) {

    $scope.user = {};

    $scope.login = function () {

        var flag = false;
        var userId = 0;

        $http.get('https://zvqzxh7ngd.execute-api.us-west-2.amazonaws.com/prod/users?TableName=user').then(function (response) {
            for (var user in response.data.Items) {
                if (response.data.Items[user].name['S'] == $scope.user.user && response.data.Items[user].password['S'] == $scope.user.password) {
                    flag = true;
                    userId = response.data.Items[user].id['N'];
                    break;
                }
            }

            if (flag) {
                window.sessionStorage.setItem('user', userId);
                $auth.setToken("iflowtoken8650");
                $location.path('/dashboard');
            } else {
                $location.path('/login');
                $scope.error = "Usuario o contraseña no válidas";
            }

        }).catch(function (error) {
            console.log(error);
        });
    };

}