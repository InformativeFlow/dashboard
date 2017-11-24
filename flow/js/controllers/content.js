'use strict';
angular.module('app')
        .controller('contentCtrl', contentCtrl);
angular.module('app')
        .directive('fileModel', ['$parse', function ($parse) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        var model = $parse(attrs.fileModel);
                        var modelSetter = model.assign;

                        element.bind('change', function () {
                            scope.$apply(function () {
                                modelSetter(scope, element[0].files[0]);
                            });
                        });
                    }
                };
            }]);
contentCtrl.$inject = ['$scope', '$state', '$timeout', '$http', 'creds', 'ngToast', 'configService', '$location', '$anchorScroll'];
function contentCtrl($scope, $state, $timeout, $http, creds, ngToast, configService, $location, $anchorScroll) {
    $scope.creds = {};
    $scope.creds.access_key = creds.apiKey;
    $scope.creds.secret_key = creds.apiSecret;
    $scope.creds.bucketImg = 'iflowimgin';
    $scope.creds.bucketVid = 'iflowvidin';


    $scope.uploadFileTrue = false;
    $scope.msg = "Completado";
    $scope.branchesTimeInterval = [];

    function getVideos() {
        $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video', configService.getConfig()).then(function (res) {
            $scope.contentVideos = [];
            for (var item in  res.data.Items) {
                if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString())
                    $scope.contentVideos.push(res.data.Items[item]);
            }
//            console.log(JSON.stringify($scope.contentVideos));
        });
    }
    ;
    function getImages() {
        $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image', configService.getConfig()).then(function (res) {
            $scope.contentImages = [];
            for (var item in  res.data.Items) {
                if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString())
                    $scope.contentImages.push(res.data.Items[item]);
            }
//            console.log(JSON.stringify($scope.contentImages));
        });
    }
    ;
    function getBranches() {
        $scope.branchesTimeInterval = [];
        $http.get('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', configService.getConfig()).then(function (response) {

            for (var item in response.data.Items) {
                if (response.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString())
                    $scope.branchesTimeInterval.push(response.data.Items[item]);
            }

        });
    }
    ;
    function getPromotions() {
        //Se listan las promociones disponibles de un hotel.

        //TEMPORAL Mientras alejo conecta las promociones para un hotel especifico
        //  $http.get('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios?TableName=promotion').then(function (res) {
        //    $scope.contentPromotions = res.data.Items;
        //   });
        //ALEJO, por favor agregar en tabla promotions, el campo user, para garantizar que la promo pertence a un hotel especidico

        $http.get('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios?TableName=promotion', configService.getConfig()).then(function (res) {
            $scope.contentPromotions = [];
            $scope.promoIds = [];
            $scope.promoNewIds = [];
            for (var item in  res.data.Items) {
                if (res.data.Items[item].user['S'] == window.sessionStorage.getItem('user').toString()) {
                    $scope.contentPromotions.push(res.data.Items[item]);
                    $scope.promoIds.push(parseInt(res.data.Items[item].id["N"]));

                }
                $scope.promoNewIds.push(parseInt(res.data.Items[item].id["N"]));
            }

        });
    }
    ;

    getImages();
    getVideos();
    getPromotions();
    getBranches();

    function setPromoNewId() {
        var newId = 1;
        if($scope.promoNewIds.length > 0){
            newId = Math.max.apply(this, $scope.promoNewIds) + 1;
        }
        return newId;
    }

    AWS.config.update({accessKeyId: $scope.creds.access_key, secretAccessKey: $scope.creds.secret_key});
    AWS.config.region = 'us-west-2';
    $scope.bucketImg = new AWS.S3({params: {Bucket: $scope.creds.bucketImg}});
    $scope.bucketVid = new AWS.S3({params: {Bucket: $scope.creds.bucketVid}});

    $scope.uploadFile = function () {
        $scope.uploadFileTrue = true;
        var file = $scope.myFile;
        console.log('file is ' + file.type);
        console.dir(file);

        var params = {
            Key: file.name,
            ACL: 'public-read',
            ContentType: file.type,
            Body: file,
            Metadata: {user: window.sessionStorage.getItem('user')},
            ServerSideEncryption: 'AES256'
        };

        $scope.bucketImg.putObject(params, function (error, data) {

            if (error) {
                console.log(error.message);
                return false;
            } else {
                // Upload Successfully Finished
            }
        }).on('httpUploadProgress', function (progress) {
            $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
            if ($scope.uploadProgress == 100) {
                $scope.msg = "Procesando....";
                $timeout(function () {
                    $scope.uploadProgress = 0;
                    $scope.uploadFileTrue = false;
                    getImages();
                }, 5000);

            }
            $scope.$digest();
        });
    };

    $scope.uploadVideo = function () {
        $scope.uploadFileTrue = true;

        var file = $scope.myFile;
        console.log('file is ' + file.type);
        console.dir(file);

        var params = {
            Key: file.name,
            ACL: 'public-read',
            ContentType: file.type,
            Body: file,
            Metadata: {user: window.sessionStorage.getItem('user')},
            ServerSideEncryption: 'AES256'
        };

        $scope.bucketVid.putObject(params, function (error, data) {

            if (error) {
                console.log(error.message);
                return false;
            } else {
                // Upload Successfully Finished
                console.log('File Uploaded Successfully');

            }
        }).on('httpUploadProgress', function (progress) {
            $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
            if ($scope.uploadProgress == 100) {
                $scope.msg = "Procesando....";
                $timeout(function () {
                    $scope.uploadProgress = 0;
                    $scope.uploadFileTrue = false;
                    getVideos();
                }, 5000);
            }
            $scope.$digest();
        });
    };

    $scope.deleteImage = function (name) {


        $scope.bucketImg.deleteObject({Bucket: 'iflowimgin', Key: name}, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else {
                console.log("file successfully deleted");
                getImages();
                $state.go('app.images', {}, {reload: true});
            }
        });
    };
    $scope.deleteVideo = function (name) {

        $scope.bucketVid.deleteObject({Bucket: 'iflowvidin', Key: name}, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else {
                console.log("file successfully deleted");
                $timeout(function () {
                    getVideos();
                    $state.go('app.videos', {}, {reload: true});
                }, 3000);
            }
            // successful response
        });
    };

    //CRUD PROMOTIONS
    $scope.promotion = "";
    $scope.botonSavePromotion = true;
    $scope.botonUpdatePromotion = false;
    $scope.idPromoUpdate = 0;

    $scope.formPromotion = {
        title: "",
        link_qr: "",
        image: "",
        active: "1",
        user: window.sessionStorage.getItem('user').toString()
    };

    $scope.branchInterval = {
        name: "",
        time: ""
    };

    $scope.list4 = [];
    $scope.hideMe = function () {
        return $scope.list4.length > 0;
    };

    $scope.contentExist = function () {
        //$scope.promotion = "";
        var total = $scope.list4.length;
        var last = total - 1;

        if (total > 0) {

            $scope.formPromotion.image = $scope.list4[last].path["S"]; //Asigno la url de la imagen seleccionada.

            //Solo se debe permitir una imagen
            for (var con in $scope.list4) {
                if (con < last) {
                    $scope.list4.splice(con, 1);
                    break;
                }
            }
        }
    };

    $scope.savePromotion = function (formData) {
        $scope.list4 = [];
        $scope.formPromotion.title = formData.title;
        $scope.formPromotion.link_qr = formData.link_qr;
        $scope.formPromotion.image = formData.image;
        var params = {
            "TableName": "promotion",
            "Item": {
                "id": {
                    N: setPromoNewId().toString()
                },
                "active": {
                    S: "1"
                },
                "image": {
                    S: $scope.formPromotion.image
                },
                "link_qr": {
                    S: $scope.formPromotion.link_qr
                },
                "title": {
                    S: $scope.formPromotion.title
                },
                "user": {
                    S: window.sessionStorage.getItem('user')
                }
            }
        };
        /*var resultado = "";
        for (var i in params) {
          if (params.hasOwnProperty(i)) {
              resultado += params + "." + i + " = " + params[i] + "\n";
          }
        }
        */
        var objetoAInspeccionar;
        var resultado = [];

        for(objetoAInspeccionar = params; objetoAInspeccionar !== null; objetoAInspeccionar = Object.getPrototypeOf(objetoAInspeccionar)){
           resultado = resultado.concat(Object.getOwnPropertyNames(objetoAInspeccionar)) + "\n";
        } 
        
        console.log("BODY: "+JSON.stringify(params));
        $http.post('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios', params).then(function (response) {
            console.log("respuesta de servicio: "+response);
            $scope.promotion = "Creada";
            getPromotions();
            $scope.formPromotion = {};
            $location.hash('areaPromo');
            $anchorScroll();
        });


    };

    $scope.deletePromotion = function (idPromotion) {
        //  var user = window.sessionStorage.getItem('user').toString();
        var id = idPromotion;
        //   alert(idPromotion, user);
        if (confirm("Esta seguro de borrar esta promoción?")) {
            var params = {
                "TableName": "promotion",
                "Key": {
                    "id": {
                        "N": id
                    }
                }
            };
            $http({
                method: 'DELETE',
                url: 'https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios',
                data: params,
                headers: 'aplication/json,charset=utf-8'
            }).then(function (response) {
                console.log(response);
                getPromotions();

            });

            //ALEJO por favor me colaboras generando el servicio que elimine en DynamoDB una promo asociada a un hotel (user)
            // A partir del id y user.

        }
    };

    $scope.updatePromotion = function (formData) {

        //
        //
        //ALEJO por favor me colaboras generando el servicio que actualice en DynamoDB la inforacion promo en la tabla promotions 
        // A partir de los datos que llegan en el JSON formData={title:"",link_qr:"",image:"",active:"",user:""} y el idPromo: id del promo a actualizar; 
        // alert('Informacion que se envia  para UPDATE:' + JSON.stringify(formData));
        //  


        $scope.promotion = "Actualizada";
        $scope.list4 = [];
        //ABIMELEC! QUITAR COMILLAS aca formData  cuando este lista la funcionalidad de update
        $scope.formPromotion.title = formData.title;
        $scope.formPromotion.link_qr = formData.link_qr;
        $scope.formPromotion.image = formData.image;

        var params = {
            "TableName": "promotion",
            "Key": {
                "id": {
                    "N": $scope.idPromoUpdate}
            },
            "UpdateExpression": "SET title =:t, link_qr =:l, image =:i",
            "ExpressionAttributeValues": {
                ":t": {"S": $scope.formPromotion.title},
                ":l": {"S": $scope.formPromotion.link_qr},
                ":i": {"S": $scope.formPromotion.image}
            },
            "ReturnValues": "ALL_NEW"
        };

        $http.put('https://fj40cj5l8f.execute-api.us-west-2.amazonaws.com/prod/promotios', params).then(function (response) {
            console.log(response.data);
            $scope.link_img = "";
            getPromotions();
            $scope.formPromotion = {};
            $scope.botonSavePromotion = true;
            $scope.botonUpdatePromotion = false;
            $location.hash('areaPromo');
            $anchorScroll();
        });

    };

    $scope.selectPromotion = function (idPromo) {
        $scope.idPromoUpdate = idPromo;
        $scope.botonSavePromotion = false;
        $scope.botonUpdatePromotion = true;

        for (var promo in $scope.contentPromotions) {
            if ($scope.contentPromotions[promo].id["N"] === idPromo) {
                $scope.link_img = $scope.contentPromotions[promo].image["S"];
                $scope.formPromotion.image = $scope.contentPromotions[promo].image["S"];
                $scope.formPromotion.title = $scope.contentPromotions[promo].title["S"];
                $scope.formPromotion.link_qr = $scope.contentPromotions[promo].link_qr["S"];
            }
        }
        $location.hash('areaPromo');
        $anchorScroll();
    };

    $scope.updateTimeInterval = function (branch) {

        $scope.brancheName = branch.name;
        $scope.timeInterval = branch.time;
        var params = {
            "TableName": "branch",
            "Key": {
                "name": {
                    "S": $scope.brancheName
                }
            },
            "UpdateExpression": "SET timeInterval =:t",
            "ExpressionAttributeValues": {
                ":t": {
                    "N": $scope.timeInterval
                }
            },
            "ReturnValues": "ALL_NEW"
        };
        $http.put('https://c354kdhd51.execute-api.us-west-2.amazonaws.com/prod/branches?TableName=branch', params).then(function (response) {
            console.log(response.data.Items);

            getBranches();
            $scope.branchInterval.name = "";
            $scope.branchInterval.time = "";
            $scope.stateInterval = "Actualizada";
        });
    };

    $scope.branchSelect = "";


    $scope.getInterval = function () {
        for (var branch in $scope.branchesTimeInterval) {
            if ($scope.branchesTimeInterval[branch].name["S"] === $scope.branchSelect) {
                $scope.stateInterval = "";
                $scope.branchInterval.name = $scope.branchesTimeInterval[branch].name["S"];
                $scope.branchInterval.time = $scope.branchesTimeInterval[branch].timeInterval["N"];
            }
        }
    };
    //FIN CRUD PROMOTIONS

}
;

