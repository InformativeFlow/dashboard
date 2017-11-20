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
    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', configService.getConfig()).then(function (response) {

        $scope.data = response.data.Items;

        for (var item in $scope.data) {
            for (var screen in $scope.data[item].screens["L"])
                if ($scope.data[item].screens["L"][screen]["M"].url["S"] == $scope.urlDisplay) {
                    $scope.video = $scope.data[item].screens["L"][screen]["M"].video["S"];
                }
        }

        if ($scope.video) {
        } else {
            $state.go('appSimple.404', {}, {reload: true});
        }

    });


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
                            // window.localStorage.clear();

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
    //Se listan las promociones disponibles.
    $http.get('data/promotions.json').then(function (response) {

        $scope.promotions = response.data;
        

    });

    $scope.myInterval = 10000;
    $scope.active = 0;

    var showPromotion = function () {
        //var activePromo = $scope.active;
        //var totalPromo = $scope.slides.length;

        var promise = $interval(function () {
            if ($scope.active >= $scope.promotions.length - 1) {
                $scope.active = 0;
            } else {
                $scope.active = $scope.active + 1;

            }
            console.log("Index promo actual: " + $scope.active + " - total: " + $scope.promotions.length);
        },
                $scope.myInterval);

        $scope.$on('$destroy', function () {
            $interval.cancel(promise);
        });
    };
    showPromotion();
    //FIN Mostrar Promociones
}