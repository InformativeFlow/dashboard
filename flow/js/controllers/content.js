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
contentCtrl.$inject = ['$scope', '$state', '$timeout', '$http', 'creds', 'ngToast','configService'];
function contentCtrl($scope, $state, $timeout, $http, creds, ngToast,configService) {
    $scope.creds = {};
    $scope.creds.access_key = creds.apiKey;
    $scope.creds.secret_key = creds.apiSecret;
    $scope.creds.bucketImg = 'iflowimgin';
    $scope.creds.bucketVid = 'iflowvidin';
    $scope.contentImages = {};
    $scope.contentVideos = {};
    $scope.uploadFileTrue = false;
    $scope.msg = "Completado";

    function getVideos() {
        $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video', configService.getConfig()).then(function (res) {
            $scope.contentVideos = res.data.Items;
            console.log(JSON.stringify($scope.contentVideos));
        });
    }
    ;
    function getImages() {
        $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image', configService.getConfig()).then(function (res) {
            $scope.contentImages = res.data.Items;
            console.log(JSON.stringify($scope.contentImages));
        });
    }
    ;
    getImages();
    getVideos();

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

};



