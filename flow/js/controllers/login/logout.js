'use strict';
angular.module('app')
        .controller('logoutCtrl', logoutCtrl);

logoutCtrl.$inject = ['$scope', '$http', '$location', '$auth','$state'];
function logoutCtrl($scope, $http, $location, $auth,$state) {

    if (!$auth.isAuthenticated()) {
        return;
    }
    $auth.logout()
            .then(function () {
                //toastr.info('You have been logged out');
                console.log("Cerrando sesión");
                window.sessionStorage.removeItem('user');
                $state.go('appSimple.login', {}, {reload: true});
                $location.path('/');
            });
}