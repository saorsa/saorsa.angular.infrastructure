(function () {
    'use strict';
    var interceptors = angular.module('saorsa.interceptors')
        .config(['$httpProvider', function($httpProvider) {
                var interceptor = ['$q', function($q) {
                        return {
                            'request': function(config) {
                                if (config.url.startsWith('/api/')) {
                                    Saorsa.Utils.showLoading();
                                }
                                return config;
                            },
                            'response': function(response) {
                                if (response.data && response.data.messages) {
                                    Saorsa.Utils.showMessages(response.data);
                                }
                                if (response.config.url.startsWith('/api/')) {
                                    response.data = Saorsa.Utils.TransformReferencePreservedJson(response.data);
                                    Saorsa.Utils.hideLoading();
                                }
                                return response;
                            },
                            'requestError': function(response) {
                                Saorsa.Utils.hideLoading();
                                return response;
                            },
                            'responseError': function(response) {
                                Saorsa.Utils.hideLoading();
                                if (response.status === 404 || response.status == 500) {
                                    return $q.reject(response);
                                }
                                return response;
                            }
                        };
                    }];
                $httpProvider.interceptors.push(interceptor);
            }
        ]);
})();