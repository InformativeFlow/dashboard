//main.js
angular
        .module('app')
        .controller('loadBranchesCtrl', loadBranchesCtrl);


loadBranchesCtrl.$inject = ['$scope', '$http', 'configService'];
function loadBranchesCtrl($scope, $http, configService) {

    $scope.branches = [];
    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', configService.getConfig()).then(function (response) {

        for (var item in response.data.Items) {
            if (response.data.Items[item].user['S'] === window.sessionStorage.getItem('user').toString())
                $scope.branches.push(response.data.Items[item]);
        }

    });
    $scope.contentPromotions = [];
    $http.get('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios?TableName=promotion', configService.getConfig()).then(function (res) {
            
            for (var item in  res.data.Items) {
                if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString()) {
                    $scope.contentPromotions.push(res.data.Items[item]);

                }
            }

        });


}


