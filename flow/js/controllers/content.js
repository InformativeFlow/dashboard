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
contentCtrl.$inject = ['$scope', 'Upload', '$timeout', '$http', 'creds'];
function contentCtrl($scope, Upload, $timeout, $http, creds) {
    $scope.creds = {};
    $scope.creds.access_key = creds.apiKey;
    $scope.creds.secret_key = creds.apiSecret;
    $scope.creds.bucketImg = 'iflowimgin';
    $scope.creds.bucketVid = 'iflowvidin';
    $scope.contentImages = {};
    $scope.contentVideos = {};



    function getVideos() {
        $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video').then(function (res) {
            $scope.contentVideos = res.data.Items;
            console.log(JSON.stringify($scope.contentVideos));
        });
    }
    ;
    function getImages() {
        $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image').then(function (res) {
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
                console.log('File Uploaded Successfully');

            }
        }).on('httpUploadProgress', function (progress) {
            $scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
            if ($scope.uploadProgress == 100) {
                $scope.uploadProgress = 0;
                getImages();
            }
            $scope.$digest();
        });
    };

    $scope.uploadVideo = function () {
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
                $scope.uploadProgress = 0;
                getVideos();
                
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
            }
            // successful response
        });
    };
    $scope.deleteVideo = function (name) {
        console.log(name);
        $scope.bucketVid.deleteObject({Bucket: 'iflowvidin', Key: name}, function (err, data) {
            if (err)
                console.log(err, err.stack); // an error occurred
            else {
                console.log("file successfully deleted");
                getVideos();
            }
            // successful response
        });
    };

}
;



/*  
 $scope.callVideos = function () {
 $http.get('https://1y0rxj9ll6.execute-api.us-west-2.amazonaws.com/prod/dbvideos?TableName=video').then(function (response) {
 $scope.contentVideos = response.data.Items;
 });
 }
 
 $scope.deleteImage = function (id) {
 console.log("Enviando id de la imagen a borrar " + id);
 }
 
 $scope.deleteVideo = function (id) {
 console.log("Enviando id del video a borrar " + id);
 }
 
 $scope.callImages();
 $scope.callVideos();
 
 }
 
 
 /*
 * mod.controller('videoCtrl', ['$scope', '$http',
 function (scope, http) {
 
 scope.creds= {};
 scope.uploadProgress = 0;
 
 scope.creds.bucket = "iflowvidin";
 
 AWS.config.update({ accessKeyId: scope.creds.access_key, secretAccessKey: scope.creds.secret_key });
 AWS.config.region = 'us-west-2';
 var bucket = new AWS.S3({ params: { Bucket: scope.creds.bucket } });
 
 scope.uploadFile = function(){
 var file = scope.myFile;
 console.log('file is '+ file.type );
 console.dir(file);
 
 
 var params = {
 Key: file.name,
 ContentType:file.type,
 Body: file,
 ServerSideEncryption: 'AES256'
 };
 
 bucket.putObject(params,function(error,data){
 
 if(error) {
 console.log(error.message);
 return false;
 }
 else {
 // Upload Successfully Finished
 console.log('File Uploaded Successfully');
 window.location.reload();
 }
 var params = {
 Key: file.name,
 ContentType:file.type,
 Body: file,
 ServerSideEncryption: 'AES256'
 };
 
 bucket.putObject(params,function(error,data){
 
 if(error) {
 console.log(error.message);
 return false;
 }
 else {
 // Upload Successfully Finished
 console.log('File Uploaded Successfully');
 window.location.reload();
 }
 }).on('httpUploadProgress',function(progress) {
 scope.uploadProgress = Math.round(progress.loaded / progress.total * 100);
 scope.$digest();
 });
 
 };
 
 var paramslist = {
 Bucket: 'iflowvidin',
 Delimiter: '/'
 };
 
 
 bucket.listObjects(paramslist,
 function (err, data) {
 if(err)throw err;
 scope.records = data.Contents;
 });
 
 scope.listBucketObjects = function(){
 return scope.records;
 
 };
 scope.deleteBucketObj = function(name){
 bucket.deleteObject({Bucket: 'iflowvidin',Key:name}, function(err, data) {
 if (err) console.log(err, err.stack); // an error occurred
 else     console.log("file successfully deleted");           // successful response
 });};
 }
 ]);
 
 })(window.angular);
 */