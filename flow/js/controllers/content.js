'use strict';
angular.module('app')
        .controller('contentCtrl', contentCtrl);

contentCtrl.$inject = ['$scope', 'Upload', '$timeout', '$http'];
function contentCtrl($scope, Upload, $timeout, $http) {

    $scope.contentImages = [];
    /*
     * El siguiente método recibe sea imagenes o videos para guardar en el servicio que recibe los archivos.
     * @param {type} files: Es el arreglo de archivos que carga el usuario
     * @param {type} errFiles: En caso dado que se viole alguna regla como el tamaño máximo o se envie un error desde el servidor.
     * @returns {Un json con la información del o los archivos almacenados}
     */
    $scope.uploadFiles = function (files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $timeout(function () {
                        $scope.files = [];
                        $scope.callImages();
                        $scope.callVideos();
                    }, 5000);

                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;

                $timeout(function () {
                    $scope.errorMsg = {};
                }, 5000);
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
            });
        });
    }

    $scope.callImages = function () {
        $http.get('https://r4mhv473uk.execute-api.us-west-2.amazonaws.com/prod/dbimages?TableName=image').then(function (response) {
            $scope.contentImages = response.data.Items;
        });
    }
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