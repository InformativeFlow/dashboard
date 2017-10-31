'use strict';
angular.module('app')
        .controller('promotionCtrl', promotionCtrl);

promotionCtrl.$inject = ['$scope', '$state'];
function promotionCtrl($scope, $state) {
    var X = 10000;
    var randomCode = Math.floor(Math.random()*(X+1)); 
    
    $scope.urlPromotion = $state.params.url;
    
    console.log("Promo URL: "+$scope.urlPromotion + " - Code: " + randomCode);
    
    $scope.infoUsuario = {
        name: "",
        document: "",
        email: "",
        room: "",
        urlPromo: $scope.urlPromotion,
        code:randomCode
    };
    
    $scope.mostrarForm = true;
    $scope.mostrarCode = false;
    
    $scope.getCode = function () {
        console.log("Gurdando info de codigo de activacion promo para usuario." + $scope.infoUsuario.name);
        //$scope.infoUsuario.code = $scope.randomCode;
        var data = {
            name: $scope.infoUsuario.name,
            document: $scope.infoUsuario.document,
            email: $scope.infoUsuario.email,
            room: $scope.infoUsuario.room,
            urlPromo:$scope.infoUsuario.urlPromo,
            code:$scope.infoUsuario.code
        };
        
        /* -Cuando tenga el servicio POST de alejo
        $http.post('', data).then(function(response) {
            
            //Mostrar codigo generado.
            $scope.mostrarForm = false;
            $scope.mostrarCode = true;
            
            console.log("Code generated!!! --> " + $scope.infoUsuario.code); 
            
            
        },
        function(err){
            console.log(err, err.stack); // an error occurred
        });
        */
        
        //Mostrar codigo generado -- QUitar cuando tenga Servicio de Alejo.
        $scope.mostrarForm = false;
        $scope.mostrarCode = true;
       
       //Limpiar variables 
       $scope.infoUsuario.name = "";
       $scope.infoUsuario.document = "";
       $scope.infoUsuario.email = "";
       $scope.infoUsuario.room = "";
       $scope.infoUsuario.urlPromo = "";
    };
    
    $scope.showForm = function () {
        return $scope.mostrarForm;
    };
    
    $scope.showCode = function () {
        return $scope.mostrarCode;
    };
    
}
