'use strict';
angular.module('app')
        .controller('screenCtrl', screenCtrl);

screenCtrl.$inject = ['$scope', '$http', '$state', '$q', 'creds'];
function screenCtrl($scope, $http, $state, $q, creds) {

    $scope.creds = {};
    $scope.creds.access_key = creds.apiKey;
    $scope.creds.secret_key = creds.apiSecret;

    AWS.config.update({accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key});
    AWS.config.region = 'us-west-2';
    var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    var queueURL = "https://sqs.us-west-2.amazonaws.com/344712433810/screens";

    $scope.branchId = $state.params.branchId;
    $scope.screenId = $state.params.screenId;

    $scope.screens = [];
    $scope.screensBranch = [];
    $scope.contentImages = [];
    $scope.contentVideos = [];
    $scope.idsImg = [];
    $scope.idsVideo = [];
    $scope.paramsMsg = {};
    $scope.list4 = [];

    $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch').then(function (response) {

        $scope.screens = response.data.Items;

        for (var item in $scope.screens) {
            if ($scope.screens[item].id["N"] == $scope.branchId) {
                console.log($scope.screens[item]["screens"]["L"][0]["M"].url);
                $scope.branchSelectedName = $scope.screens[item].name["S"];
                $scope.screensBranch = $scope.screens[item].screens["L"];
                for (var screen in $scope.screensBranch) {
                    if ($scope.screensBranch[screen]["M"].id["N"] == $scope.screenId) {

                        $scope.paramsMsg = {
                            MessageBody: $scope.screensBranch[screen]["M"].url['S'],
                            QueueUrl: queueURL

                        };
                        for (var content in $scope.screensBranch[screen]["M"].content["L"]) {

                            $scope.list4.push($scope.screensBranch[screen]["M"].content["L"][content]["M"]);
                            
                            if ($scope.screensBranch[screen]["M"].content["L"][content]["M"].type["S"] == "img") {
                                //console.log($scope.screensBranch[screen]["M"].content["L"][content]["M"]);
                                $scope.idsImg.push($scope.screensBranch[screen]["M"].content["L"][content]["M"].id["N"]);
                            } else {
                                $scope.idsVideo.push($scope.screensBranch[screen]["M"].content["L"][content]["M"].id["N"]);
                            }
                        }
                    }
                }
            }
        }
    });

    $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image').then(function (response) {

        $scope.contentImages = response.data.Items;
    });

    $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video').then(function (response) {

        $scope.contentVideos = response.data.Items;
    });

    /*
     * Método que retorna el contenido asociado a una pantalla.
     * Se envia el id de la pantalla y se espera recibir un array como el que retorna el siguiente servicio
     * @returns {Boolean}
     * 
     */

    $scope.hideMe = function () {
        return $scope.list4.length > 0;
    };


    $scope.saveContent = function () {

        if ($scope.list4.length > 0) {
            $scope.listReady = [];

            for (var item in $scope.list4) {
                var mapbuilder = {};
                var logic = $scope.list4[item].type["S"] === "img" ? $scope.idsImg.lastIndexOf($scope.list4[item].id["N"]) : $scope.idsVideo.lastIndexOf($scope.list4[item].id["N"]);
                if (logic === -1) {
                    delete $scope.list4[item]["$$hashKey"];
                    mapbuilder["M"] = $scope.list4[item];
                    $scope.listReady.push(mapbuilder);
                }
            }
            console.log(JSON.stringify($scope.listReady));
            var idx = $scope.screenId - 1;
            var p = {};
            for (var vid in $scope.listReady) {

                if ($scope.listReady[vid]["M"].type["S"] == 'video') {
                    p = {"TableName": "branch",
                        "Key": {
                            "name": {
                                "S": $scope.branchSelectedName
                            }},
                        "UpdateExpression": "SET screens[" + idx + "].video =:video",
                        "ExpressionAttributeValues": {":video": {"S": "https://s3-us-west-2.amazonaws.com/iflowvidin/" + $scope.listReady[vid]["M"].name["S"]}
                        },
                        "ReturnValues": "UPDATED_NEW"
                    }
                }
                ;

                break;
            }
        }

        console.log(JSON.stringify(p));
        $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', p).then(function (response) {
            console.log(response.data);
            
            sqs.sendMessage($scope.paramsMsg, function (err, data) {
                if (err)
                    console.log(err, err.stack); // an error occurred
                else
                    console.log(data);           // successful response
            });

        });
        var params = {
            "TableName": "branch",
            "Key": {
                "name": {
                    "S": $scope.branchSelectedName
                }
            },
            "UpdateExpression": "SET #ri[" + idx + "].content = list_append( #ri[" + idx + "].content,:vals)",
            "ExpressionAttributeNames": {"#ri": "screens"},
            "ExpressionAttributeValues": {
                ":vals": {"L": $scope.listReady}
            },
            "ReturnValues": "UPDATED_NEW"
        };
        console.log(JSON.stringify(params));
        if (logic === -1)
            $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', params).then(function (response) {
                console.log(response.data);
            });
    };

    $scope.removeItem = function (item, ev) {
        var count =0;
        var idx = $scope.screenId - 1;
        for (var con in $scope.list4)
            if($scope.list4[con].type['S']==='video')
                count = count+1;
            
        for (var con in $scope.list4)
            if ($scope.list4[con].id["N"] === item.id["N"]) {
                if($scope.list4[con].type['S']==='video' & count<2){
                    var defaultVideo ={
                        "TableName": "branch",
                        "Key": {
                            "name": {
                                "S": $scope.branchSelectedName
                            }},
                        "UpdateExpression": "SET screens[" + idx + "].video =:video",
                        "ExpressionAttributeValues": {":video": {"S": "https://s3-us-west-2.amazonaws.com/iflowvidout/default.mp4"}
                        },
                        "ReturnValues": "UPDATED_NEW"
                    
                    };
                     $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', defaultVideo).then(function (response) {
                        console.log(response.data);
                    var element = ev.target;
                    var parent = element.parentElement;
                    parent.removeChild(element);
                    delete $scope.list4[con];
                    sqs.sendMessage($scope.paramsMsg, function (err, data) {
                        if (err)
                            console.log(err, err.stack); // an error occurred
                        else
                            console.log(data);   
                     });
                });
            }  
                var params = {
                    "TableName": "branch",
                    "Key": {
                        "name": {
                            "S": $scope.branchSelectedName
                        }
                    },
                    "UpdateExpression": "REMOVE screens[" + idx + "].content[" + con + "]",
                    "ReturnValues": "ALL_NEW"
                };
                $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', params).then(function (response) {
                    console.log(response.data);
                    var element = ev.target;
                    var parent = element.parentElement;
                    parent.removeChild(element);
                    delete $scope.list4[con];
                    sqs.sendMessage($scope.paramsMsg, function (err, data) {
                        if (err)
                            console.log(err, err.stack); // an error occurred
                        else
                            console.log(data);           // successful response
                    });

                });
            }
        
    };

    $scope.deleteContent = function () {
        sqs.sendMessage($scope.paramsMsg, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else
                console.log(data);           // successful response
        });
        var idx = $scope.screenId - 1;
        for (var screen in $scope.screensBranch)
            for (var content in $scope.screensBranch[screen]["M"].content["L"]) {
                console.log(JSON.stringify($scope.screensBranch[screen]["M"].content["L"][content]));
                console.log(content);
                var params = {
                    "TableName": "branch",
                    "Key": {
                        "name": {
                            "S": $scope.branchSelectedName
                        }
                    },
                    "UpdateExpression": "REMOVE screens[" + idx + "].content[" + content + "]",
                    "ReturnValues": "ALL_NEW"
                };
                
                var defaultVideo ={
                        "TableName": "branch",
                        "Key": {
                            "name": {
                                "S": $scope.branchSelectedName
                            }},
                        "UpdateExpression": "SET screens[" + idx + "].video =:video",
                        "ExpressionAttributeValues": {":video": {"S": "https://s3-us-west-2.amazonaws.com/iflowvidout/default.mp4"}
                        },
                        "ReturnValues": "UPDATED_NEW"
                    
                    };
                     $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', defaultVideo).then(function (response) {
                        console.log(response.data);
                    sqs.sendMessage($scope.paramsMsg, function (err, data) {
                        if (err)
                            console.log(err, err.stack); // an error occurred
                        else
                            console.log(data);   
                     });
                });
                
                console.log(JSON.stringify(params));

                $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches', params).then(function (response) {
                    console.log(response.data);
                    $scope.list4 = [];

                });
            }
    };

    $scope.list2 = {};

    $scope.beforeDrop = function () {

        var deferred = $q.defer();
        //  if (confirm('¿Desea borrar el contenido?')) {
        $scope.list2 = {};
        deferred.resolve();
        // } else {
        //   deferred.reject();
        //}
        return deferred.promise;
    };

    $scope.contentExist = function () {
        console.log("Revisando items en lista.");
        var items = '';
        var item = '';
        var typeItem = '';
        var newItem = '';
        var typeNewItem = '';
        var total = $scope.list4.length;
        var last = total - 1;

        if (total > 0) {
            newItem = $scope.list4[last].id["N"];
            typeNewItem = $scope.list4[last].type["S"];

            //Se valida si el nuevo item agregado ya existe en la lista y en caso positivo se elimina de esta.
            for (var con in $scope.list4) {
                item = $scope.list4[con].id["N"];
                typeItem = $scope.list4[con].type["S"];

                items = items + '-' + con + ':' + item + ", tipo: " + typeItem;
                if (con < last) {
                    if ((newItem == item) && (typeNewItem == typeItem)) {
                        console.log("existe en pos " + con);
                        //Se elimina el elemnto de la lista.
                        $scope.list4.splice(last, 1);
                        break;
                    }
                }
            }
            console.log("items: " + items);
            console.log("newItem: " + newItem + " en pos: " + last);
            console.log("Total: " + $scope.list4.length);
        }
    };



}
