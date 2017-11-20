angular
        .module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', '$authProvider',
            function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider, $authProvider) {

                $urlRouterProvider.otherwise('/dashboard');

                $ocLazyLoadProvider.config({
                    // Set to true if you want to see what and when is dynamically loaded
                    debug: true
                });

                $breadcrumbProvider.setOptions({
                    prefixStateName: 'app.main',
                    includeAbstract: true,
                    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
                });

                $authProvider.httpInterceptor = function () {
                    return true;
                }
                $authProvider.withCredentials = false;
                $authProvider.tokenRoot = null;
                $authProvider.baseUrl = '/';
                $authProvider.loginUrl = '/data/user';
                $authProvider.tokenName = 'token';
                $authProvider.tokenPrefix = 'satellizer';
                $authProvider.tokenHeader = 'Authorization';
                $authProvider.tokenType = 'Bearer';
                $authProvider.storageType = 'localStorage';


                /**
                 * Helper auth functions
                 */
                var skipIfLoggedIn = ['$auth', function ($auth) {
                        if ($auth.isAuthenticated()) {
                            return true;
                        } else {
                            return false;
                        }
                    }];

                var loginRequired = ['$location', '$auth', '$state',function ($location, $auth,$state) {
                        if ($auth.isAuthenticated()) {
                            return true;
                        } else {
                            $state.go('appSimple.login', {}, {reload: true});
                        
                        }

                    }];


                $stateProvider
                        .state('app', {
                            abstract: true,
                            templateUrl: 'views/common/layouts/full.html',
                            controller: 'branchesCtrl',
                            //page title goes here
                            ncyBreadcrumb: {
                                label: 'Root',
                                skip: true
                            },
                            resolve: {
                                loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load CSS files
                                        return $ocLazyLoad.load([{
                                                serie: true,
                                                name: 'Font Awesome',
                                                files: ['node_modules/font-awesome/css/font-awesome.min.css']
                                            }, {
                                                serie: true,
                                                name: 'Simple Line Icons',
                                                files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
                                            }]);
                                    }],
                                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load files for an existing module
                                        return $ocLazyLoad.load([{
                                                serie: true,
                                                name: 'chart.js',
                                                files: [
                                                    'node_modules/chart.js/dist/Chart.min.js',
                                                    'node_modules/angular-chart.js/dist/angular-chart.min.js'
                                                ]
                                            }]);
                                    }],
                            }
                        })
                        .state('app.main', {
                            url: '/dashboard',
                            templateUrl: 'views/main.html',
                            //page title goes here
                            ncyBreadcrumb: {
                                label: 'Dashboard',
                            },
                            //page subtitle goes here
                            params: {subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit'},
                            resolve: {
                                loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load files for an existing module
                                        return $ocLazyLoad.load([
                                            {
                                                serie: true,
                                                name: 'chart.js',
                                                files: [
                                                    'node_modules/chart.js/dist/Chart.min.js',
                                                    'node_modules/angular-chart.js/dist/angular-chart.min.js'
                                                ]
                                            },
                                        ]);
                                    }],
                                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load controllers
                                        return $ocLazyLoad.load({
                                            files: ['js/controllers/main.js']
                                        });
                                    }],
                                loginRequired: loginRequired

                            }
                        })
                        .state('appSimple', {
                            abstract: true,
                            templateUrl: 'views/common/layouts/simple.html',
                            resolve: {
                                loadCSS: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load CSS files
                                        return $ocLazyLoad.load([{
                                                serie: true,
                                                name: 'Font Awesome',
                                                files: ['node_modules/font-awesome/css/font-awesome.min.css']
                                            }, {
                                                serie: true,
                                                name: 'Simple Line Icons',
                                                files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
                                            }]);
                                    }],
                            }
                        })

                        // Additional Pages
                        .state('appSimple.login', {
                            url: '/login',
                            templateUrl: 'views/login/login.html',
                            controller: 'loginCtrl',
                            resolve: {
                                skipIfLoggedIn: skipIfLoggedIn
                            }
                        })
                        .state('appSimple.logout', {
                            url: '/logout',
                            template: null,
                            controller: 'logoutCtrl'
                        })
                        .state('appSimple.register', {
                            url: '/register',
                            templateUrl: 'views/pages/register.html'
                        })
                        .state('appSimple.404', {
                            url: '/404',
                            templateUrl: 'views/pages/404.html'
                        })
                        .state('appSimple.500', {
                            url: '/500',
                            templateUrl: 'views/pages/500.html'
                        })
                        .state('display', {
                            url: '/screen/{url:.*}',
                            param: {url: null},
                            templateUrl: 'views/display/display.html',
                            controller: 'displayCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }]
                            },
                        })
                        
            }]);
