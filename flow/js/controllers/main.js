//main.js
angular
.module('app')
.controller('cardChartCtrl2', cardChartCtrl2)
.controller('loadBranchesCtrl', loadBranchesCtrl);

cardChartCtrl2.$inject = ['$scope'];
function cardChartCtrl2($scope) {

  $scope.labels = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio'];
  $scope.data = [
    [5, 18, 9, 17, 34, 22, 11]
  ];
  $scope.colors = [{
    backgroundColor: brandInfo,
    borderColor: 'rgba(255,255,255,.55)',
  }];
  
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, $scope.data[0]) - 5,
          max: Math.max.apply(Math, $scope.data[0]) + 5
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      }
    }
  }
}

loadBranchesCtrl.$inject = ['$scope', '$http','configService'];
function loadBranchesCtrl($scope, $http,configService) {

    $scope.branches = [];
    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', configService.getConfig()).then(function (response) {

        $scope.branches = response.data.Items;

    });


}


