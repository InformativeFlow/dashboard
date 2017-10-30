'use strict';
//angular.module('app',['msl.slides']);
angular.module('app');

promotionCtrl.$inject = ['$scope', '$state'];
function promotionCtrl($scope, $state) {
    $scope.urlPromotion = $state.params.url;
}
