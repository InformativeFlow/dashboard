'use strict';
angular.module('app')
        .controller('loginCtrl', loginCtrl);

loginCtrl.$inject = ['$scope', '$http', '$location', '$auth','configService'];
function loginCtrl($scope, $http, $location, $auth,configService) {

    $scope.user = {};

    $scope.login = function () {
        
        $http.get('https://zvqzxh7ngd.execute-api.us-west-2.amazonaws.com/prod/users?TableName=user').then(function (response) {
         console.log(JSON.stringify(response.data.Items))
            for (var user in response.data.Items)
             if (response.data.Items[user].name['S'] == $scope.user.user && response.data.Items[user].password['S'] == $scope.user.password ){
                 window.sessionStorage.setItem('user',response.data.Items[user].id['N']);
            $auth.setToken("iflowtoken8650");
            $location.path('/dashboard');
        }else{$location.path('/login');
         $scope.error = "invalid user or password";
            }
        }).catch(function (error) {
            console.log(error);
        })
    };

}