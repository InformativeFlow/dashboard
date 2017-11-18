// Default colors
var brandPrimary = '#20a8d8';
var brandSuccess = '#4dbd74';
var brandInfo = '#63c2de';
var brandWarning = '#f8cb00';
var brandDanger = '#f86c6b';

var grayDark = '#2a2c36';
var gray = '#55595c';
var grayLight = '#818a91';
var grayLighter = '#d1d4d7';
var grayLightest = '#f8f9fa';

angular
        .module('app', [
            'ui.router',
            'oc.lazyLoad',
            'ncy-angular-breadcrumb',
            'angular-loading-bar',
            'ngDragDrop',
            'ui.bootstrap',
            'ngFileUpload',
            'ngSanitize',
            'ngAnimate',
            'ngToast',
            'satellizer'        
])
        .config(['cfpLoadingBarProvider', '$qProvider', '$sceDelegateProvider', '$httpProvider',
            function (cfpLoadingBarProvider, $qProvider, $sceDelegateProvider, $httpProvider) {
                cfpLoadingBarProvider.includeSpinner = false;
                cfpLoadingBarProvider.latencyThreshold = 1;
                $qProvider.errorOnUnhandledRejections(false);

                $sceDelegateProvider.resourceUrlWhitelist(['self', '**']);

                $httpProvider.defaults.useXDomain = true;

                delete $httpProvider.defaults.headers.common['X-Requested-With'];


            }])
        .run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
                $rootScope.$on('$stateChangeSuccess', function () {
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                });
                $rootScope.$state = $state;
                return $rootScope.$stateParams = $stateParams;
            }]);
