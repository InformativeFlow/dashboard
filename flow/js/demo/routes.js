angular
        .module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider',
            function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

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
                        .state('app.icons', {
                            url: "/icons",
                            abstract: true,
                            template: '<ui-view></ui-view>',
                            ncyBreadcrumb: {
                                label: 'Icons'
                            }
                        })
                        .state('app.icons.fontawesome', {
                            url: '/font-awesome',
                            templateUrl: 'views/icons/font-awesome.html',
                            ncyBreadcrumb: {
                                label: 'Font Awesome'
                            }
                        })
                        .state('app.icons.simplelineicons', {
                            url: '/simple-line-icons',
                            templateUrl: 'views/icons/simple-line-icons.html',
                            ncyBreadcrumb: {
                                label: 'Simple Line Icons'
                            }
                        })
                        .state('app.components', {
                            url: "/components",
                            abstract: true,
                            template: '<ui-view></ui-view>',
                            ncyBreadcrumb: {
                                label: 'Components'
                            }
                        })
                        .state('app.components.buttons', {
                            url: '/buttons',
                            templateUrl: 'views/components/buttons.html',
                            ncyBreadcrumb: {
                                label: 'Buttons'
                            }
                        })
                        .state('app.components.social-buttons', {
                            url: '/social-buttons',
                            templateUrl: 'views/components/social-buttons.html',
                            ncyBreadcrumb: {
                                label: 'Social Buttons'
                            }
                        })
                        .state('app.components.cards', {
                            url: '/cards',
                            templateUrl: 'views/components/cards.html',
                            ncyBreadcrumb: {
                                label: 'Cards'
                            }
                        })
                        .state('app.components.forms', {
                            url: '/forms',
                            templateUrl: 'views/components/forms.html',
                            ncyBreadcrumb: {
                                label: 'Forms'
                            }
                        })
                        .state('app.components.switches', {
                            url: '/switches',
                            templateUrl: 'views/components/switches.html',
                            ncyBreadcrumb: {
                                label: 'Switches'
                            }
                        })
                        .state('app.components.tables', {
                            url: '/tables',
                            templateUrl: 'views/components/tables.html',
                            ncyBreadcrumb: {
                                label: 'Tables'
                            }
                        })
                        .state('app.widgets', {
                            url: '/widgets',
                            templateUrl: 'views/widgets.html',
                            ncyBreadcrumb: {
                                label: 'Widgets'
                            },
                            resolve: {
                                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load controllers
                                        return $ocLazyLoad.load({
                                            files: ['js/controllers/widgets.js']
                                        });
                                    }]
                            }
                        })
                        .state('app.charts', {
                            url: '/charts',
                            templateUrl: 'views/charts.html',
                            ncyBreadcrumb: {
                                label: 'Charts'
                            },
                            resolve: {
                                // Plugins loaded before
                                // loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
                                //     return $ocLazyLoad.load([
                                //         {
                                //             serial: true,
                                //             files: ['js/libs/Chart.min.js', 'js/libs/angular-chart.min.js']
                                //         }
                                //     ]);
                                // }],
                                loadMyCtrl: ['$ocLazyLoad', function ($ocLazyLoad) {
                                        // you can lazy load files for an existing module
                                        return $ocLazyLoad.load({
                                            files: ['js/controllers/charts.js']
                                        });
                                    }]
                            }
                        })
                        .state('app.branches', {
                            url: '/branch/{branchId:int}',
                            param: {
                                branchId: null
                            },
                            templateUrl: 'views/screens/screens.html',
                            controller: 'screenCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }],
                                loginRequired: loginRequired
                            },
                            ncyBreadcrumb: {
                             
                                label: 'Pantallas'
                            }
                        })
                        .state('app.screen', {
                            url: '/branch/{branchId:int}/screen/{screenId:int}',
                            param: {
                                branchId: null,
                                screenId: null
                            },
                            templateUrl: 'views/screens/screen.detail.html',
                            controller: 'screenCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }],
                                loginRequired: loginRequired
                            },
                            ncyBreadcrumb: {
                                   parent: 'app.branches',
                                label: 'Detalle '
                            }
                        })

                        .state('app.images', {
                            url: '/content/images',
                            templateUrl: 'views/content/images.html',
                            controller: 'contentCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }],
                                loginRequired: loginRequired
                            },
                            ncyBreadcrumb: {
                                label: 'Contenido / Imagenes'
                            }
                        })

                        .state('app.videos', {
                            url: '/content/videos',
                            templateUrl: 'views/content/videos.html',
                            controller: 'contentCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }],
                                loginRequired: loginRequired
                            },
                            ncyBreadcrumb: {
                                label: 'Contenido / Videos'
                            }
                        })
                        
                        .state('app.promotions', {
                            url: '/content/promotions',
                            templateUrl: 'views/content/promotions.html',
                            controller: 'contentCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }],
                                loginRequired: loginRequired
                            },
                            ncyBreadcrumb: {
                                label: 'Contenido / Promociones'
                            }
                        })
                        
                        .state('app.intervals', {
                            url: '/content/branches',
                            templateUrl: 'views/content/branches.html',
                            controller: 'contentCtrl',
                            resolve: {
                                creds: ['$http', function (r) {
                                        return r.get('data/keys.json').then(function (res) {
                                            return res.data;
                                        });
                                    }],
                                loginRequired: loginRequired
                            },
                            ncyBreadcrumb: {
                                label: 'Contenido / Intervalos'
                            }
                        });
                        
            }]);
