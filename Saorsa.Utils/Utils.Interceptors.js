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
                                if ((response.data && response.data.messages && response.data.messages.length >0) || response.modelState) {
                                    Saorsa.Utils.showMessages(response.data, Saorsa.Utils.CurrentMessageContainer);
                                    Saorsa.Utils.hideLoading();
                                    return response;
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
                            'responseError': function (response) {
                                if (response.data && response.data.modelState) {
                                    Saorsa.Utils.showMessages(response.data, Saorsa.Utils.CurrentMessageContainer);
                                }
                                Saorsa.Utils.hideLoading();
                                return $q.reject(response);
                            }
                        };
                    }];
                $httpProvider.interceptors.push(interceptor);
            }
        ]);
})();