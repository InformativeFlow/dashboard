'use strict';
angular.module('app')
        .controller('slidesCtrl', slidesCtrl);


slidesCtrl.$inject = ['$scope'];
function slidesCtrl($scope) {
    console.log("Generando Slide Shows...");


    // initializing the time Interval 
    $scope.myInterval = 5000;

    // Initializing  slide rray   
    $scope.slides = [
        {id: 1, path: 'http://www.puraitalia.com/wp-content/uploads/2014/06/Restaurante-Italiano-Comida-Italiana-Pura-Italia.png', name: 'Image1', type: 'img'},
        {id: 2, path: 'http://www.puraitalia.com/wp-content/uploads/2014/06/Restaurante-Italiano-Comida-Italiana-Pura-Italia.png', name: 'Video1', type: 'img'},
        {id: 3, path: 'http://www.puraitalia.com/wp-content/uploads/2014/06/Restaurante-Italiano-Comida-Italiana-Pura-Italia.png', name: 'Image2', type: 'img'},
        {id: 4, path: 'http://www.puraitalia.com/wp-content/uploads/2014/06/Restaurante-Italiano-Comida-Italiana-Pura-Italia.png', name: 'Video2', type: 'img'}];

    var slides = $scope.slides;


    //EJEMPLO 2 utilizando paquete: msl-slides

    /*
     
     $scope.$on(
     'msl_slides_slide_change_start',
     function (event, old_slide_number, new_slide_number) {
     console.log(
     'Changing from ' + old_slide_number + ' to ' + new_slide_number
     );
     }
     );
     $scope.$on(
     'msl_slides_slide_change_success',
     function (event, old_slide_number, new_slide_number) {
     console.log(
     'Changed from ' + old_slide_number + ' to ' + new_slide_number
     );
     }
     );
     */

}
