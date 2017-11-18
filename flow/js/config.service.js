angular.
        module('app').
        service('configService', ['$q', function ($q) {
                function getConfig() {
                    return {
                        skipAuthorization: true,
                        headers: {'Accept': 'application/json'}
                    };
                }
                return {
                    getConfig: getConfig
                };
            }]);

