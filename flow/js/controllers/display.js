'use strict';
angular.module('app')
        .controller('displayCtrl', displayCtrl);

displayCtrl.$inject = ['$scope', '$http', '$state', 'creds', 'configService', '$interval'];
function displayCtrl($scope, $http, $state, creds, configService, $interval) {
    $scope.creds = {};
    $scope.creds.access_key = creds.apiKey;
    $scope.creds.secret_key = creds.apiSecret;

    AWS.config.update({accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key});
    AWS.config.region = 'us-west-2';
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    var queueURL = "https://sqs.us-west-2.amazonaws.com/344712433810/screens";
    
    $scope.urlDisplay = $state.params.url;
    $scope.idsPromotionsScreen= []; //Lista de ids de las prmomociones asociadas a la pantalla actual.
    $scope.promotionsScreen = []; //Lista de objetos de las prmomociones asociadas a la pantalla actual.
    $scope.tituloPromo = '';
    $scope.myInterval = 10000;//Se define como tiempo del intervalo por defecto de 10 milisegindos = 10 seg
    function getBranches(){
    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', configService.getConfig()).then(function (response) {

        $scope.data = response.data.Items;
       
           var interval = 0;
        for (var item in $scope.data) {
            for (var screen in $scope.data[item].screens["L"])
                if ($scope.data[item].screens["L"][screen]["M"].url["S"] == $scope.urlDisplay) {
                    $scope.video = $scope.data[item].screens["L"][screen]["M"].video["S"];
                    //Intervalo entre promociones defindo para la sede
                    interval = $scope.data[item].timeInterval["N"];
                    interval = interval *1000;
                    
                    $scope.myInterval =  interval;
                    
                    //Lista de ids de las promociones asociadas a la pantalla actual.
                    $scope.idsPromotionsScreen = $scope.data[item].screens["L"][screen]["M"].promotions["L"];
             
                    
                }
                
        }

        if ($scope.video) {
        } else {
            $state.go('appSimple.404', {}, {reload: true});
        }
         getPromo();
    });
    };
    
   function getPromo(){ 
    //Se listan las promociones disponibles de un hotel.
    $http.get('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios?TableName=promotion', configService.getConfig()).then(function (response){
        
        $scope.promotionsBranch = response.data.Items;
        
        //Se crea el listado de objetos de las promociones asociadas a la pantalla actual.
        for(var idPromo in $scope.idsPromotionsScreen){
          
            for(var promo in $scope.promotionsBranch){
            
                if($scope.idsPromotionsScreen[idPromo]["M"].id["N"] === $scope.promotionsBranch[promo].id["N"]){
              
                    if($scope.promotionsBranch[promo].active["S"] === "1"){
                    
                        $scope.promotionsScreen.push($scope.promotionsBranch[promo]);
                    }
                }
            }            
        }
        if($scope.promotionsScreen.length) $scope.tituloPromo = 'Escanea el código QR de promociones';
    });

   };
  getBranches();
    var receiveMessageParams = {
        AttributeNames: [
            "SentTimestamp"
        ],
        MaxNumberOfMessages: 10,
        MessageAttributeNames: [
            "All"
        ],
        QueueUrl: queueURL,
        WaitTimeSeconds: 20
    };
    var receiveMessage = function () {
        sqs.receiveMessage(receiveMessageParams, function (err, data) {
            if (err) {
                console.log(err);
            }
            if (data)
                if (data.Messages) {
                    for (var i = 0; i < data.Messages.length; i++) {
                        var message = data.Messages[i];
                        var body = message.Body;
                        // execute logic


                        if (window.location.href.split('/').pop() == body) {
                          
                            window.sessionStorage.clear();
                             window.localStorage.clear();

                            window.location.reload(true);
                           
                            removeFromQueue(message);
                          
                        }

                    }
                    receiveMessage();
                } else {
                    console.log("no hay mensajes");
                    setTimeout(function () {
                        receiveMessage()
                    }, 20 * 1000);

                }
        });
    };

    var removeFromQueue = function (message) {
        sqs.deleteMessage({
            QueueUrl: queueURL,
            ReceiptHandle: message.ReceiptHandle
        }, function (err, data) {
            err && console.log(err);
        });
    };

    receiveMessage();
    console.log();

    //Mostrar Promociones
    console.log("intervalo entre promociones: "+$scope.myInterval);
    //$scope.myInterval = 10000;
    $scope.active = 0;

    var showPromotion = function () {
        
        var promise = $interval(function () {
            if ($scope.active >= $scope.promotionsScreen.length - 1) {
                $scope.active = 0;
            } else {
                $scope.active = $scope.active + 1;

            }
            //console.log("Index promo actual: " + $scope.active + " - total: " + $scope.promotionsScreen.length);
        },
        $scope.myInterval);

        $scope.$on('$destroy', function () {
            $interval.cancel(promise);
        });
    };
    showPromotion();
    //FIN Mostrar Promociones
    
}
